package com.backend.features.search.service;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.features.search.dto.AdminSearchResponseDto;
import com.backend.features.product.Product;
import com.backend.features.order.ShopOrder;
import com.backend.features.user.User;
import com.backend.features.product.enums.ProductStatus;
import com.backend.common.enums.UserRole;
import com.backend.features.order.repository.OrderRepository;
import com.backend.features.product.repository.ProductRepository;
import com.backend.features.user.repository.UserRepository;
import com.backend.features.auth.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminSearchService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public AdminSearchResponseDto search(String query, int limit) {
        SecurityUtils.requireRole(UserRole.ADMIN);

        String keyword = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);
        int resultLimit = Math.min(Math.max(limit, 1), 20);

        List<AdminSearchResponseDto.AdminSearchOrderDto> orders = orderRepository.findAll().stream()
                .filter(order -> matchesOrder(order, keyword))
                .limit(resultLimit)
                .map(this::toSearchOrder)
                .toList();

        List<AdminSearchResponseDto.AdminSearchProductDto> products = productRepository.findAll().stream()
                .filter(product -> product.getStatus() != ProductStatus.DELETED)
                .filter(product -> matchesProduct(product, keyword))
                .limit(resultLimit)
                .map(this::toSearchProduct)
                .toList();

        List<AdminSearchResponseDto.AdminSearchCustomerDto> customers = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.CUSTOMER)
                .filter(user -> matchesCustomer(user, keyword))
                .limit(resultLimit)
                .map(this::toSearchCustomer)
                .toList();

        return AdminSearchResponseDto.builder()
                .orders(orders)
                .products(products)
                .customers(customers)
                .build();
    }

    private boolean matchesOrder(ShopOrder order, String keyword) {
        if (keyword.isBlank()) {
            return false;
        }
        return order.getId().toString().toLowerCase(Locale.ROOT).contains(keyword)
                || order.getUser().getFullName().toLowerCase(Locale.ROOT).contains(keyword)
                || order.getUser().getEmail().toLowerCase(Locale.ROOT).contains(keyword);
    }

    private boolean matchesProduct(Product product, String keyword) {
        if (keyword.isBlank()) {
            return false;
        }
        return product.getName().toLowerCase(Locale.ROOT).contains(keyword)
                || product.getSlug().toLowerCase(Locale.ROOT).contains(keyword);
    }

    private boolean matchesCustomer(User user, String keyword) {
        if (keyword.isBlank()) {
            return false;
        }
        return user.getFullName().toLowerCase(Locale.ROOT).contains(keyword)
                || user.getEmail().toLowerCase(Locale.ROOT).contains(keyword);
    }

    private AdminSearchResponseDto.AdminSearchOrderDto toSearchOrder(ShopOrder order) {
        String orderId = order.getId().toString();
        return AdminSearchResponseDto.AdminSearchOrderDto.builder()
                .id(orderId)
                .orderCode(orderId.substring(0, 8).toUpperCase(Locale.ROOT))
                .customerName(order.getUser().getFullName())
                .status(order.getStatus())
                .build();
    }

    private AdminSearchResponseDto.AdminSearchProductDto toSearchProduct(Product product) {
        return AdminSearchResponseDto.AdminSearchProductDto.builder()
                .id(product.getId().toString())
                .name(product.getName())
                .slug(product.getSlug())
                .build();
    }

    private AdminSearchResponseDto.AdminSearchCustomerDto toSearchCustomer(User user) {
        return AdminSearchResponseDto.AdminSearchCustomerDto.builder()
                .id(user.getId().toString())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}
