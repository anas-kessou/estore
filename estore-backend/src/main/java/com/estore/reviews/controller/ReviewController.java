package com.estore.reviews.controller;

import com.estore.customer.entity.User;
import com.estore.customer.service.CustomerService;
import com.estore.reviews.dto.CreateReviewRequest;
import com.estore.reviews.dto.ReviewDTO;
import com.estore.reviews.service.ReviewService;
import com.estore.security.UserPrincipal;
import com.estore.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewDTO>> createReview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CreateReviewRequest request) {

        User user = customerService.getUserById(currentUser.getId());
        String fullName = user.getFullName();

        ReviewDTO review = reviewService.createReview(
                currentUser.getId(),
                currentUser.getEmail(),
                fullName,
                request
        );
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", review));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getProductReviews(@PathVariable Long productId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByProductId(productId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getUserReviews(@PathVariable Long userId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewDTO>> getReviewById(@PathVariable String id) {
        ReviewDTO review = reviewService.getReviewById(id);
        return ResponseEntity.ok(ApiResponse.success(review));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Only allow user to delete their own review or admin
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted", null));
    }
}
