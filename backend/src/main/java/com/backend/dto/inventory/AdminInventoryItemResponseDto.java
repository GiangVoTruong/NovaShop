package com.backend.dto.inventory;

import com.backend.enums.ProductStatus;

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
public class AdminInventoryItemResponseDto {

    private String productId;
    private String name;
    private String sku;
    private int stock;
    private int soldCount;
    private ProductStatus status;
    private String primaryImageUrl;
    private String categoryName;
    private String sellerName;
}
