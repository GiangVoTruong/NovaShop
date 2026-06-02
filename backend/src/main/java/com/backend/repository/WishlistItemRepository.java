package com.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.WishlistItem;

public interface WishlistItemRepository extends JpaRepository<WishlistItem, UUID> {

    List<WishlistItem> findByUser_IdOrderByAddedAtDesc(UUID userId);

    Optional<WishlistItem> findByUser_IdAndProduct_Id(UUID userId, UUID productId);

    boolean existsByUser_IdAndProduct_Id(UUID userId, UUID productId);

    void deleteByUser_IdAndProduct_Id(UUID userId, UUID productId);
}
