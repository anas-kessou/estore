package com.estore.reviews.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    private String id;

    @Indexed
    private Long productId;

    @Indexed
    private Long userId;

    private String authorName;

    private String authorEmail;

    @Indexed
    private Integer rating;

    private String comment;

    @Indexed
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Builder.Default
    private boolean approved = true;
}
