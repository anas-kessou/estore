package com.estore.catalog.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long id;
    private String name;
    private BigDecimal price;
    private String description;
    private String imageUrl;
    private String imageUrls;
    private boolean active;
    private boolean featured;
    private Integer stockQuantity;
    private Integer availableStock;
    private boolean inStock;
    private boolean lowStock;
    private Long categoryId;
    private String categoryName;
    private Double averageRating;
    private Integer reviewCount;
    private LocalDateTime createdAt;
}
