package com.estore.catalog.admin.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminDeleteProductResponse {
    private String externalId;
    private boolean deleted;
}
