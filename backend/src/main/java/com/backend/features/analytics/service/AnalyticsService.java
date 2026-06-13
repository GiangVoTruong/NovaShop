package com.backend.features.analytics.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.features.analytics.dto.AdminAnalyticsSummaryResponseDto;
import com.backend.features.analytics.dto.GetAnalyticsOverviewResponseDto;
import com.backend.features.order.enums.OrderStatus;
import com.backend.features.product.enums.ProductStatus;
import com.backend.common.enums.UserRole;
import com.backend.features.order.repository.OrderItemRepository;
import com.backend.features.order.repository.OrderRepository;
import com.backend.features.product.repository.ProductRepository;
import com.backend.features.user.repository.UserRepository;
import com.backend.features.auth.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import com.backend.features.product.Product;
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public AdminAnalyticsSummaryResponseDto getSummary() {
        SecurityUtils.requireRole(UserRole.ADMIN);

        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        OffsetDateTime from = today.atStartOfDay().atOffset(ZoneOffset.UTC);
        OffsetDateTime to = today.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC);

        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long lowStockProducts = productRepository.findAll().stream()
                .filter(product -> product.getStatus() != ProductStatus.DELETED)
                .filter(product -> product.getStock() > 0 && product.getStock() <= 20)
                .count();

        return AdminAnalyticsSummaryResponseDto.builder()
                .pendingOrders(pendingOrders)
                .lowStockProducts(lowStockProducts)
                .todayRevenue(orderRepository.sumFinalAmountBetween(from, to))
                .todayOrders(orderRepository.countByCreatedAtBetween(from, to))
                .build();
    }

    @Transactional(readOnly = true)
    public GetAnalyticsOverviewResponseDto getOverview(LocalDate fromDate, LocalDate toDate) {
        SecurityUtils.requireRole(UserRole.ADMIN);

        OffsetDateTime from = fromDate != null
                ? fromDate.atStartOfDay().atOffset(ZoneOffset.UTC)
                : OffsetDateTime.now().minusYears(1);
        OffsetDateTime to = toDate != null
                ? toDate.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC)
                : OffsetDateTime.now().plusDays(1);

        BigDecimal totalRevenue = orderRepository.sumFinalAmountBetween(from, to);
        long totalOrders = orderRepository.countByCreatedAtBetween(from, to);

        List<GetAnalyticsOverviewResponseDto.RevenueByMonthDto> revenueByMonth = new ArrayList<>();
        for (Object[] row : orderRepository.revenueByMonthBetween(from, to)) {
            revenueByMonth.add(GetAnalyticsOverviewResponseDto.RevenueByMonthDto.builder()
                    .month((String) row[0])
                    .revenue((BigDecimal) row[1])
                    .build());
        }

        List<GetAnalyticsOverviewResponseDto.OrdersByStatusDto> ordersByStatus = new ArrayList<>();
        for (Object[] row : orderRepository.countGroupByStatusBetween(from, to)) {
            ordersByStatus.add(GetAnalyticsOverviewResponseDto.OrdersByStatusDto.builder()
                    .status((OrderStatus) row[0])
                    .count((Long) row[1])
                    .build());
        }

        List<GetAnalyticsOverviewResponseDto.TopProductDto> topProducts = new ArrayList<>();
        for (Object[] row : orderItemRepository.findTopProductsBetween(from, to)) {
            topProducts.add(GetAnalyticsOverviewResponseDto.TopProductDto.builder()
                    .productId((UUID) row[0])
                    .name((String) row[1])
                    .soldCount(((Number) row[2]).longValue())
                    .revenue((BigDecimal) row[3])
                    .build());
        }

        return GetAnalyticsOverviewResponseDto.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(totalOrders)
                .totalCustomers(userRepository.countByRole(UserRole.CUSTOMER))
                .totalProducts(productRepository.count())
                .revenueByMonth(revenueByMonth)
                .ordersByStatus(ordersByStatus)
                .topProducts(topProducts)
                .build();
    }
}
