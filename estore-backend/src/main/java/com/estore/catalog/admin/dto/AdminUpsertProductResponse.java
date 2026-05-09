package com.estore.catalog.admin.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminUpsertProductResponse {
    private Long productId;
    private boolean updated;
}
