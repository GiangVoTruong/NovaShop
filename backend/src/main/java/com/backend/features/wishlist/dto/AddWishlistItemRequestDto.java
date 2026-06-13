package com.backend.features.wishlist.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import com.backend.features.product.Product;
@Getter
@Setter
public class AddWishlistItemRequestDto {

    @NotNull(message = "Product ID is required")
    private UUID productId;
}
