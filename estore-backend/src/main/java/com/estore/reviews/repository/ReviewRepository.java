package com.estore.reviews.repository;

import com.estore.reviews.document.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Review> findByProductIdAndApprovedTrueOrderByCreatedAtDesc(Long productId);

    long countByProductId(Long productId);

    default double averageRatingByProductId(Long productId) {
        List<Review> reviews = findByProductIdAndApprovedTrueOrderByCreatedAtDesc(productId);
        if (reviews.isEmpty()) {
            return 0.0;
        }

        double total = reviews.stream()
                .mapToInt(Review::getRating)
                .sum();

        return total / reviews.size();
    }
}
