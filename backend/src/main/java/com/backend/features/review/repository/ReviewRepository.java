package com.backend.features.review.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.features.review.Review;
import com.backend.features.review.enums.ReviewStatus;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    Page<Review> findByProductIdAndStatusOrderByCreatedAtDesc(
            UUID productId, ReviewStatus status, Pageable pageable);

    Page<Review> findByProductIdOrderByCreatedAtDesc(UUID productId, Pageable pageable);

    Page<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Optional<Review> findByIdAndUserId(UUID id, UUID userId);

    long countByUserIdAndProductId(UUID userId, UUID productId);
}
