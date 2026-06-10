package com.backend.dto.reviews;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.backend.enums.ReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetReviewResponseDto {

    private UUID id;
    private UUID userId;
    private String userFullName;
    private UUID productId;
    private short rating;
    private String comment;
    private ReviewStatus status;
    private OffsetDateTime createdAt;
}
