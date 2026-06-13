package com.backend.features.product.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import com.backend.features.product.enums.ProductStatus;

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
public class GetProductResponseDto {

    private UUID id;
    private UUID sellerId;
    private String sellerName;
    private UUID categoryId;
    private String categoryName;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stock;
    private Integer soldCount;
    private BigDecimal avgRating;
    private Integer reviewCount;
    private ProductStatus status;
    private List<String> imageUrls;
    private String primaryImageUrl;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
