package com.estore.catalog.admin;

import com.estore.catalog.admin.dto.AdminDeleteProductResponse;
import com.estore.catalog.admin.dto.AdminUpsertProductRequest;
import com.estore.catalog.admin.dto.AdminUpsertProductResponse;
import com.estore.catalog.admin.dto.ProductsCsvImportSummary;
import com.estore.catalog.admin.service.AdminProductService;
import com.estore.catalog.admin.service.ProductsCsvImportService;
import com.estore.shared.dto.ApiResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/import/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductImportController {

    private final AdminProductService adminProductService;
    private final ProductsCsvImportService csvImportService;

    @PostMapping(value = "/csv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ProductsCsvImportSummary>> importCsv(@RequestParam("file") MultipartFile file) {
        ProductsCsvImportSummary summary = csvImportService.importProducts(file);
        return ResponseEntity.ok(ApiResponse.success("CSV Import Processed", summary));
    }

    @PostMapping("/upsert")
    public ResponseEntity<ApiResponse<AdminUpsertProductResponse>> upsertProduct(@RequestBody AdminUpsertProductRequest request) {
        AdminUpsertProductResponse response = adminProductService.upsert(request);
        return ResponseEntity.ok(ApiResponse.success("Product upserted successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        adminProductService.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @DeleteMapping("/external/{externalId}")
    public ResponseEntity<ApiResponse<AdminDeleteProductResponse>> deleteProductByExternalId(@PathVariable String externalId) {
        AdminDeleteProductResponse response = adminProductService.deleteByExternalId(externalId);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", response));
    }
}
