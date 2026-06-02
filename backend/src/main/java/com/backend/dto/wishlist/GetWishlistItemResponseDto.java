package com.backend.dto.wishlist;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.backend.dto.products.GetProductResponseDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetWishlistItemResponseDto {

    private UUID id;
    private UUID productId;
    private GetProductResponseDto product;
    private OffsetDateTime addedAt;
}
