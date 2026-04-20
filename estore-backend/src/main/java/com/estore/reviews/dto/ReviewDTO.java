package com.estore.reviews.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {

    private String id;
    private Long productId;
    private Long userId;
    private String authorName;
    private String authorEmail;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
