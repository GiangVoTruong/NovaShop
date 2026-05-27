package com.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.SellerApplication;
import com.backend.enums.SellerApplicationStatus;

public interface SellerApplicationRepository extends JpaRepository<SellerApplication, UUID> {

    Optional<SellerApplication> findByUserIdAndStatus(UUID userId, SellerApplicationStatus status);

    List<SellerApplication> findByStatusOrderByCreatedAtDesc(SellerApplicationStatus status);

    List<SellerApplication> findAllByOrderByCreatedAtDesc();
}
