package com.estore.inventory.controller;

import com.estore.inventory.dto.InventoryDTO;
import com.estore.inventory.dto.InventoryUpdateRequest;
import com.estore.inventory.service.InventoryService;
import com.estore.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/{productId}")
    public ResponseEntity<ApiResponse<InventoryDTO>> getInventory(@PathVariable Long productId) {
        InventoryDTO inventory = inventoryService.getInventoryByProductId(productId);
        return ResponseEntity.ok(ApiResponse.success(inventory));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ApiResponse<InventoryDTO>> updateInventory(
            @PathVariable Long productId,
            @Valid @RequestBody InventoryUpdateRequest request) {

        InventoryDTO updatedInventory = inventoryService.updateInventory(productId, request);
        return ResponseEntity.ok(ApiResponse.success("Inventory updated successfully", updatedInventory));
    }
}
