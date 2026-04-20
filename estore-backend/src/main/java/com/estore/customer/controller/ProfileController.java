package com.estore.customer.controller;

import com.estore.customer.dto.ProfileUpdateRequest;
import com.estore.customer.dto.UserDTO;
import com.estore.customer.service.CustomerService;
import com.estore.security.UserPrincipal;
import com.estore.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final CustomerService customerService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDTO>> getProfile(@PathVariable Long userId) {
        UserDTO profile = customerService.getUserProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody ProfileUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Verify user is updating their own profile
        if (!currentUser.getId().equals(userId)) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("You can only update your own profile"));
        }

        UserDTO updatedProfile = customerService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedProfile));
    }
}
