package com.estore.catalog.admin.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class AdminUpsertProductRequest {

    /**
     * Stable unique key used to link products between CSV import and reviews.
     */
    private String externalId;

    private String name;

    /** CSV uses "Brand Desc" for Product.description */
    private String brandDesc;

    private BigDecimal sellPrice;

    private String categoryName;

    private String imageUrl;

    private Boolean active;

    private Boolean featured;

    private Integer stockQuantity;
}
