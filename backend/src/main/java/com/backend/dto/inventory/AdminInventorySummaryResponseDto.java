package com.backend.dto.inventory;

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
public class AdminInventorySummaryResponseDto {

    private long totalSkus;
    private long lowStockCount;
    private long outOfStockCount;
    private long totalUnitsInStock;
}
