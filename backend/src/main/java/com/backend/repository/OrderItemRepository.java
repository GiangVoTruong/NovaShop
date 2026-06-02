package com.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

    List<OrderItem> findByOrderId(UUID orderId);

    long countByOrder_Id(UUID orderId);

    @org.springframework.data.jpa.repository.Query(value = """
            SELECT oi.product_id, oi.product_name, SUM(oi.quantity), COALESCE(SUM(oi.subtotal), 0)
            FROM order_items oi
            INNER JOIN orders o ON o.id = oi.order_id
            WHERE o.created_at BETWEEN :from AND :to
            GROUP BY oi.product_id, oi.product_name
            ORDER BY SUM(oi.quantity) DESC
            LIMIT 10
            """, nativeQuery = true)
    java.util.List<Object[]> findTopProductsBetween(
            java.time.OffsetDateTime from,
            java.time.OffsetDateTime to);
}
