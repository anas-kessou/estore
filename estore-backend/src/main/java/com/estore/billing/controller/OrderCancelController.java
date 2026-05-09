package com.estore.billing.controller;

import com.estore.billing.dto.OrderDTO;

import com.estore.billing.service.BillingService;
import com.estore.security.UserPrincipal;
import com.estore.shared.dto.ApiResponse;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderCancelController {

    private final BillingService billingService;

    // Customer (non-admin) cancel endpoint.
    // Cancels only orders owned by the current user and still in PENDING state.
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<ApiResponse<OrderDTO>> cancelOrder(
            @org.springframework.security.core.annotation.AuthenticationPrincipal UserPrincipal currentUser,
            @org.springframework.web.bind.annotation.PathVariable @NotNull Long orderId) {

        OrderDTO order = billingService.cancelOrderForUser(orderId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Order cancelled", order));
    }
}
