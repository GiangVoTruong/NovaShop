package com.backend.features.seller.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.features.seller.SellerApplication;
import com.backend.features.seller.enums.SellerApplicationStatus;

public interface SellerApplicationRepository extends JpaRepository<SellerApplication, UUID> {

    Optional<SellerApplication> findByUserIdAndStatus(UUID userId, SellerApplicationStatus status);

    List<SellerApplication> findByStatusOrderByCreatedAtDesc(SellerApplicationStatus status);

    List<SellerApplication> findAllByOrderByCreatedAtDesc();
}
