package com.estore.catalog.admin;

import com.estore.catalog.admin.dto.ProductsCsvImportSummary;
import com.estore.catalog.admin.service.ProductsCsvImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/import")
@RequiredArgsConstructor
public class AdminProductImportController {

    private final ProductsCsvImportService productsCsvImportService;

    @PostMapping(value = "/products-csv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ProductsCsvImportSummary importProductsCsv(@RequestPart("file") MultipartFile file) {
        return productsCsvImportService.importProducts(file);
    }
}
