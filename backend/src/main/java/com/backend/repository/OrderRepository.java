package com.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.backend.entity.ShopOrder;

public interface OrderRepository extends JpaRepository<ShopOrder, UUID> {

    List<ShopOrder> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("""
            SELECT DISTINCT shopOrder FROM ShopOrder shopOrder
            JOIN FETCH shopOrder.user
            WHERE shopOrder.id = :orderId
            """)
    java.util.Optional<ShopOrder> findDetailedById(UUID orderId);
}
