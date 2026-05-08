package com.estore.catalog.admin.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ProductsCsvImportSummary {

    private final int totalRows;
    private final int created;
    private final int updated;
    private final int skipped;
    private final int failed;

    private final List<String> errors; // first N errors
}
