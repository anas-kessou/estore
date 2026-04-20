package com.estore.inventory.service;

import com.estore.catalog.entity.Product;
import com.estore.catalog.repository.ProductRepository;
import com.estore.exception.ResourceNotFoundException;
import com.estore.inventory.dto.InventoryDTO;
import com.estore.inventory.dto.InventoryUpdateRequest;
import com.estore.inventory.entity.Inventory;
import com.estore.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public InventoryDTO getInventoryByProductId(Long productId) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "productId", productId));
        return toInventoryDTO(inventory);
    }

    @Transactional
    public InventoryDTO updateInventory(Long productId, InventoryUpdateRequest request) {
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "productId", productId));

        if (request.getQuantity() != null) {
            inventory.setQuantity(request.getQuantity());
        }
        if (request.getLowStockThreshold() != null) {
            inventory.setLowStockThreshold(request.getLowStockThreshold());
        }

        inventory = inventoryRepository.save(inventory);

        // Also update product stock
        Product product = inventory.getProduct();
        product.setStockQuantity(inventory.getAvailableQuantity());
        productRepository.save(product);

        return toInventoryDTO(inventory);
    }

    @Transactional
    public boolean decrementStock(Long productId, Integer quantity) {
        int updated = inventoryRepository.decrementQuantity(productId, quantity);
        if (updated > 0) {
            // Update product stock
            inventoryRepository.findByProductId(productId).ifPresent(inventory -> {
                Product product = inventory.getProduct();
                product.setStockQuantity(inventory.getAvailableQuantity());
                productRepository.save(product);
            });
            return true;
        }
        return false;
    }

    @Transactional
    public void incrementStock(Long productId, Integer quantity) {
        inventoryRepository.incrementQuantity(productId, quantity);
        // Update product stock
        inventoryRepository.findByProductId(productId).ifPresent(inventory -> {
            Product product = inventory.getProduct();
            product.setStockQuantity(inventory.getAvailableQuantity());
            productRepository.save(product);
        });
    }

    @Transactional
    public InventoryDTO createInventoryForProduct(Product product) {
        Inventory inventory = Inventory.builder()
                .product(product)
                .quantity(product.getStockQuantity() != null ? product.getStockQuantity() : 0)
                .reservedQuantity(0)
                .lowStockThreshold(10)
                .build();

        inventory = inventoryRepository.save(inventory);
        return toInventoryDTO(inventory);
    }

    private InventoryDTO toInventoryDTO(Inventory inventory) {
        return InventoryDTO.builder()
                .id(inventory.getId())
                .productId(inventory.getProduct().getId())
                .productName(inventory.getProduct().getName())
                .quantity(inventory.getQuantity())
                .availableQuantity(inventory.getAvailableQuantity())
                .reservedQuantity(inventory.getReservedQuantity())
                .lowStockThreshold(inventory.getLowStockThreshold())
                .lowStock(inventory.isLowStock())
                .inStock(inventory.isInStock())
                .build();
    }
}
