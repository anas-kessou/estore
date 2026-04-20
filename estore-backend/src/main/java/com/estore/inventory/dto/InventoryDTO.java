package com.estore.inventory.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryDTO {

    private Long id;
    private Long productId;
    private String productName;
    private Integer quantity;
    private Integer availableQuantity;
    private Integer reservedQuantity;
    private Integer lowStockThreshold;
    private boolean lowStock;
    private boolean inStock;
}
