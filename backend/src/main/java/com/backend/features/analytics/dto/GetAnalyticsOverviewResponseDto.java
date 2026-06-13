package com.backend.features.analytics.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.backend.features.order.enums.OrderStatus;

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
public class GetAnalyticsOverviewResponseDto {

    private BigDecimal totalRevenue;
    private long totalOrders;
    private long totalCustomers;
    private long totalProducts;
    private List<RevenueByMonthDto> revenueByMonth;
    private List<OrdersByStatusDto> ordersByStatus;
    private List<TopProductDto> topProducts;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RevenueByMonthDto {
        private String month;
        private BigDecimal revenue;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrdersByStatusDto {
        private OrderStatus status;
        private long count;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopProductDto {
        private UUID productId;
        private String name;
        private long soldCount;
        private BigDecimal revenue;
    }
}
