package com.backend.features.wishlist.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddWishlistItemRequestDto {

    @NotNull(message = "Product ID is required")
    private UUID productId;
}
