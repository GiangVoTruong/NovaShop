package com.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    Page<Review> findByProductIdOrderByCreatedAtDesc(UUID productId, Pageable pageable);

    Optional<Review> findByIdAndUserId(UUID id, UUID userId);

    boolean existsByUserIdAndProductId(UUID userId, UUID productId);
}
