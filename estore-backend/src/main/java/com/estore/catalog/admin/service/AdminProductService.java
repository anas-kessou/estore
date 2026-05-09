package com.estore.catalog.admin.service;

import com.estore.catalog.admin.dto.AdminDeleteProductResponse;
import com.estore.catalog.admin.dto.AdminUpsertProductRequest;
import com.estore.catalog.admin.dto.AdminUpsertProductResponse;
import com.estore.catalog.entity.Category;
import com.estore.catalog.entity.Product;
import com.estore.catalog.repository.CategoryRepository;
import com.estore.catalog.repository.ProductRepository;
import com.estore.reviews.repository.ReviewRepository;
import com.estore.exception.BadRequestException;
import com.estore.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final InventoryService inventoryService;

    @Transactional
    public AdminUpsertProductResponse upsert(AdminUpsertProductRequest request) {
        if (request == null) {
            throw new BadRequestException("Request body is required");
        }
        if (request.getExternalId() == null || request.getExternalId().isBlank()) {
            throw new BadRequestException("externalId is required");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new BadRequestException("name is required");
        }
        if (request.getSellPrice() == null) {
            throw new BadRequestException("sellPrice is required");
        }
        if (request.getCategoryName() == null || request.getCategoryName().isBlank()) {
            throw new BadRequestException("categoryName is required");
        }

        String externalId = request.getExternalId().trim();
        String normalizedCategoryName = normalizeCategoryName(request.getCategoryName());

        Category category = categoryRepository.findByName(normalizedCategoryName)
                .orElseGet(() -> categoryRepository.save(
                        Category.builder()
                                .name(normalizedCategoryName)
                                .description(null)
                                .active(true)
                                .displayOrder(0)
                                .build()));

        Optional<Product> existingOpt = productRepository.findByExternalId(externalId);
        boolean updated = existingOpt.isPresent();

        Product toSave;
        if (updated) {
            toSave = existingOpt.get();
        } else {
            toSave = Product.builder()
                    .externalId(externalId)
                    .active(request.getActive() != null ? request.getActive() : true)
                    .featured(request.getFeatured() != null ? request.getFeatured() : false)
                    .stockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0)
                    .build();
        }

        toSave.setName(request.getName().trim());
        toSave.setDescription(request.getBrandDesc() != null && !request.getBrandDesc().isBlank()
                ? request.getBrandDesc().trim()
                : null);
        toSave.setPrice(request.getSellPrice());
        toSave.setCategory(category);

        if (request.getActive() != null) {
            toSave.setActive(request.getActive());
        }
        if (request.getFeatured() != null) {
            toSave.setFeatured(request.getFeatured());
        }
        if (request.getStockQuantity() != null) {
            toSave.setStockQuantity(request.getStockQuantity());
        }

        // imageUrl optional
        if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            toSave.setImageUrl(request.getImageUrl().trim());
        } else if (toSave.getImageUrl() == null || toSave.getImageUrl().isBlank()) {
            // deterministic-ish placeholder
            String query = request.getName().trim().toLowerCase().replaceAll("\\s+", " ").replace("&", "and");
            toSave.setImageUrl("https://source.unsplash.com/600x600/?" + urlEncode(query));
        }

        Product saved = productRepository.save(toSave);

        // Ensure Inventory exists and stays consistent with Product.stockQuantity
        int stockQty = saved.getStockQuantity() != null ? saved.getStockQuantity() : 0;
        try {
            inventoryService.getInventoryByProductId(saved.getId());
            inventoryService.updateInventory(saved.getId(), com.estore.inventory.dto.InventoryUpdateRequest.builder()
                    .quantity(stockQty)
                    .build());
        } catch (com.estore.exception.ResourceNotFoundException ex) {
            // Inventory row may not exist yet
            inventoryService.createInventoryForProduct(saved);
        }

        return AdminUpsertProductResponse.builder()
                .productId(saved.getId())
                .updated(updated)
                .build();
    }

    @Transactional
    public void deleteById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new com.estore.exception.ResourceNotFoundException(
                        "Product", "id", id));

        // Cleanup Mongo reviews by productId
        reviewRepository.deleteByProductId(id);

        productRepository.delete(product);
    }

    @Transactional
    public AdminDeleteProductResponse deleteByExternalId(String externalId) {
        if (externalId == null || externalId.isBlank()) {
            throw new BadRequestException("externalId is required");
        }

        Product product = productRepository.findByExternalId(externalId.trim())
                .orElseThrow(() -> new com.estore.exception.ResourceNotFoundException(
                        "Product", "externalId", externalId));

        Long productId = product.getId();

        // Cleanup Mongo reviews by productId (sync requirement)
        reviewRepository.deleteByProductId(productId);

        productRepository.delete(product);

        return AdminDeleteProductResponse.builder()
                .externalId(externalId.trim())
                .deleted(true)
                .build();
    }

    // CSV import uses a simplified normalization (trim + collapse spaces)
    private String normalizeCategoryName(String raw) {
        return raw.trim().replaceAll("\\s+", " ");
    }

    private String urlEncode(String input) {
        try {
            return URLEncoder.encode(input, StandardCharsets.UTF_8.name());
        } catch (UnsupportedEncodingException e) {
            // should never happen with UTF-8
            return input;
        }
    }
}
