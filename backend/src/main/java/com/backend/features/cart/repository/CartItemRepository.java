package com.backend.features.cart.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.backend.features.cart.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {

    List<CartItem> findByCartId(UUID cartId);

    Optional<CartItem> findByCartIdAndProductId(UUID cartId, UUID productId);

    void deleteByCartId(UUID cartId);

    @Query("""
            SELECT item FROM CartItem item
            JOIN FETCH item.product product
            LEFT JOIN FETCH product.seller
            WHERE item.cart.id = :cartId
            """)
    List<CartItem> findDetailedByCartId(UUID cartId);
}
