package com.estore.catalog.controller;

import com.estore.catalog.dto.ProductDTO;
import com.estore.catalog.service.CatalogService;
import com.estore.shared.dto.ApiResponse;
import com.estore.shared.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final CatalogService catalogService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductDTO>>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long categoryId) {

        PageResponse<ProductDTO> products = catalogService.getProducts(page, size, categoryId);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> getProductById(@PathVariable Long id) {
        ProductDTO product = catalogService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<ProductDTO>>> searchProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageResponse<ProductDTO> products = catalogService.searchProducts(q, categoryId, page, size);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getFeaturedProducts(
            @RequestParam(defaultValue = "8") int limit) {

        List<ProductDTO> products = catalogService.getFeaturedProducts(limit);
        return ResponseEntity.ok(ApiResponse.success(products));
    }
}
