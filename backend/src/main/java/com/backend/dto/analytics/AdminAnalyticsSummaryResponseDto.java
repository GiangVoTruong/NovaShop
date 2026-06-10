package com.backend.dto.analytics;

import java.math.BigDecimal;

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
public class AdminAnalyticsSummaryResponseDto {

    private long pendingOrders;
    private long lowStockProducts;
    private BigDecimal todayRevenue;
    private long todayOrders;
}
