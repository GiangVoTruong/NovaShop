package com.backend.repository;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.backend.entity.ShopOrder;
import com.backend.enums.OrderStatus;

public interface OrderRepository extends JpaRepository<ShopOrder, UUID>, JpaSpecificationExecutor<ShopOrder> {

    long countByStatus(OrderStatus status);

    List<ShopOrder> findByUserIdOrderByCreatedAtDesc(UUID userId);

    long countByCreatedAtBetween(OffsetDateTime from, OffsetDateTime to);

    @Query("SELECT COALESCE(SUM(shopOrder.finalAmount), 0) FROM ShopOrder shopOrder WHERE shopOrder.createdAt BETWEEN :from AND :to")
    BigDecimal sumFinalAmountBetween(OffsetDateTime from, OffsetDateTime to);

    @Query("""
            SELECT shopOrder.status, COUNT(shopOrder)
            FROM ShopOrder shopOrder
            WHERE shopOrder.createdAt BETWEEN :from AND :to
            GROUP BY shopOrder.status
            """)
    List<Object[]> countGroupByStatusBetween(OffsetDateTime from, OffsetDateTime to);

    @Query(value = """
            SELECT TO_CHAR(shop_order.created_at, 'YYYY-MM') AS month,
                   COALESCE(SUM(shop_order.final_amount), 0)
            FROM orders shop_order
            WHERE shop_order.created_at BETWEEN :from AND :to
            GROUP BY TO_CHAR(shop_order.created_at, 'YYYY-MM')
            ORDER BY month
            """, nativeQuery = true)
    List<Object[]> revenueByMonthBetween(OffsetDateTime from, OffsetDateTime to);

    @Query("""
            SELECT DISTINCT shopOrder FROM ShopOrder shopOrder
            JOIN FETCH shopOrder.user
            WHERE shopOrder.id = :orderId
            """)
    java.util.Optional<ShopOrder> findDetailedById(UUID orderId);

    @Query("""
            SELECT DISTINCT shopOrder FROM ShopOrder shopOrder
            JOIN OrderItem orderItem ON orderItem.order = shopOrder
            JOIN Product product ON product.id = orderItem.productId
            WHERE product.seller.id = :sellerId
            ORDER BY shopOrder.createdAt DESC
            """)
    List<ShopOrder> findBySellerIdOrderByCreatedAtDesc(UUID sellerId);

    @Query("""
            SELECT DISTINCT shopOrder FROM ShopOrder shopOrder
            JOIN OrderItem orderItem ON orderItem.order = shopOrder
            JOIN Product product ON product.id = orderItem.productId
            WHERE product.seller.id = :sellerId AND shopOrder.id = :orderId
            """)
    java.util.Optional<ShopOrder> findBySellerIdAndOrderId(UUID sellerId, UUID orderId);

    @Query("""
            SELECT CASE WHEN COUNT(orderItem) > 0 THEN true ELSE false END
            FROM OrderItem orderItem
            JOIN orderItem.order shopOrder
            WHERE shopOrder.user.id = :userId
              AND shopOrder.status = com.backend.enums.OrderStatus.DELIVERED
              AND orderItem.productId = :productId
            """)
    boolean hasDeliveredOrderWithProduct(UUID userId, UUID productId);
}
