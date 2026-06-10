package com.backend.repository;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.EmailVerification;

public interface EmailVerificationRepository extends JpaRepository<EmailVerification, UUID> {

    Optional<EmailVerification> findFirstByUserIdAndVerifiedAtIsNullOrderByCreatedAtDesc(UUID userId);

    Optional<EmailVerification> findFirstByUserIdOrderByCreatedAtDesc(UUID userId);

    void deleteByUserIdAndVerifiedAtIsNull(UUID userId);

    long countByUserIdAndCreatedAtAfter(UUID userId, OffsetDateTime createdAt);
}
