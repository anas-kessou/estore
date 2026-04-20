package com.estore.reviews.service;

import com.estore.catalog.repository.ProductRepository;
import com.estore.customer.entity.User;
import com.estore.exception.ResourceNotFoundException;
import com.estore.reviews.document.Review;
import com.estore.reviews.dto.CreateReviewRequest;
import com.estore.reviews.dto.ReviewDTO;
import com.estore.reviews.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    @Transactional
    public ReviewDTO createReview(Long userId, String userEmail, String userFullName, CreateReviewRequest request) {
        // Verify product exists
        if (!productRepository.existsById(request.getProductId())) {
            throw new ResourceNotFoundException("Product", "id", request.getProductId());
        }

        Review review = Review.builder()
                .productId(request.getProductId())
                .userId(userId)
                .authorName(userFullName)
                .authorEmail(userEmail)
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(LocalDateTime.now())
                .approved(true)
                .build();

        review = reviewRepository.save(review);
        return toReviewDTO(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProductIdAndApprovedTrueOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toReviewDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toReviewDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReviewDTO getReviewById(String id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));
        return toReviewDTO(review);
    }

    @Transactional
    public void deleteReview(String id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Review", "id", id);
        }
        reviewRepository.deleteById(id);
    }

    private ReviewDTO toReviewDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .productId(review.getProductId())
                .userId(review.getUserId())
                .authorName(review.getAuthorName())
                .authorEmail(review.getAuthorEmail())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
