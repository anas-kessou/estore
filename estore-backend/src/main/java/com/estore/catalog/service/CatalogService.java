package com.estore.catalog.service;

import com.estore.catalog.dto.CategoryDTO;
import com.estore.catalog.dto.ProductDTO;
import com.estore.catalog.entity.Category;
import com.estore.catalog.entity.Product;
import com.estore.catalog.repository.CategoryRepository;
import com.estore.catalog.repository.ProductRepository;
import com.estore.exception.ResourceNotFoundException;
import com.estore.shared.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final com.estore.inventory.service.InventoryService inventoryService;

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::toCategoryDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return toCategoryDTO(category);
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductDTO> getProducts(int page, int size, Long categoryId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> productPage;

        if (categoryId != null) {
            productPage = productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
        } else {
            productPage = productRepository.findByActiveTrue(pageable);
        }

        List<ProductDTO> products = productPage.getContent().stream()
                .map(this::toProductDTO)
                .collect(Collectors.toList());

        return PageResponse.<ProductDTO>builder()
                .content(products)
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .first(productPage.isFirst())
                .last(productPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return toProductDTO(product);
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductDTO> searchProducts(String keyword, Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage;

        if (categoryId != null && keyword != null && !keyword.isBlank()) {
            productPage = productRepository.searchByKeywordAndCategory(keyword.trim(), categoryId, pageable);
        } else if (keyword != null && !keyword.isBlank()) {
            productPage = productRepository.searchByKeyword(keyword.trim(), pageable);
        } else if (keyword == null || keyword.isBlank()) {
            if (categoryId != null) {
                productPage = productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
            } else {
                productPage = productRepository.findByActiveTrue(pageable);
            }
        } else {
            productPage = productRepository.findByActiveTrue(pageable);
        }

        List<ProductDTO> products = productPage.getContent().stream()
                .map(this::toProductDTO)
                .collect(Collectors.toList());

        return PageResponse.<ProductDTO>builder()
                .content(products)
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .first(productPage.isFirst())
                .last(productPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getFeaturedProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return productRepository.findByFeaturedTrueAndActiveTrue(pageable)
                .stream()
                .map(this::toProductDTO)
                .collect(Collectors.toList());
    }

    private CategoryDTO toCategoryDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .displayOrder(category.getDisplayOrder())
                .active(category.isActive())
                .build();
    }

    private ProductDTO toProductDTO(Product product) {
        com.estore.inventory.dto.InventoryDTO inventory;
        
        if (product.getInventory() != null) {
            // Use pre-fetched inventory to avoid N+1 queries
            var inv = product.getInventory();
            inventory = com.estore.inventory.dto.InventoryDTO.builder()
                    .availableQuantity(inv.getAvailableQuantity())
                    .inStock(inv.isInStock())
                    .lowStock(inv.isLowStock())
                    .build();
        } else {
            try {
                inventory = inventoryService.getInventoryByProductId(product.getId());
            } catch (Exception e) {
                // Fallback if inventory is missing
                inventory = com.estore.inventory.dto.InventoryDTO.builder()
                        .availableQuantity(product.getStockQuantity() != null ? product.getStockQuantity() : 0)
                        .inStock((product.getStockQuantity() != null ? product.getStockQuantity() : 0) > 0)
                        .lowStock(false)
                        .build();
            }
        }

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .imageUrls(product.getImageUrls())
                .active(product.isActive())
                .featured(product.isFeatured())
                .stockQuantity(inventory.getAvailableQuantity())
                .availableStock(inventory.getAvailableQuantity())
                .inStock(inventory.isInStock())
                .lowStock(inventory.isLowStock())

                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .createdAt(product.getCreatedAt())
                .build();
    }
}
