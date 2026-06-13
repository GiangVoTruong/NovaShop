package com.backend.features.inventory.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.features.inventory.dto.AdminInventoryItemResponseDto;
import com.backend.features.inventory.dto.AdminInventorySummaryResponseDto;
import com.backend.features.product.Product;
import com.backend.features.product.enums.ProductStatus;
import com.backend.common.enums.UserRole;
import com.backend.features.product.repository.ProductImageRepository;
import com.backend.features.product.repository.ProductRepository;
import com.backend.features.auth.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private static final int LOW_STOCK_THRESHOLD = 20;

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    @Transactional(readOnly = true)
    public Page<AdminInventoryItemResponseDto> listInventory(
            String keyword,
            Boolean lowStockOnly,
            Boolean outOfStockOnly,
            Pageable pageable) {
        SecurityUtils.requireRole(UserRole.ADMIN);

        List<Product> products = productRepository.findAll().stream()
                .filter(product -> product.getStatus() != ProductStatus.DELETED)
                .filter(product -> matchesKeyword(product, keyword))
                .filter(product -> matchesStockFilters(product, lowStockOnly, outOfStockOnly))
                .sorted((left, right) -> compareByPageable(left, right, pageable))
                .toList();

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), products.size());
        List<AdminInventoryItemResponseDto> pageContent = new ArrayList<>();
        if (start < products.size()) {
            for (Product product : products.subList(start, end)) {
                pageContent.add(toInventoryItem(product));
            }
        }
        return new PageImpl<>(pageContent, pageable, products.size());
    }

    @Transactional(readOnly = true)
    public AdminInventorySummaryResponseDto getSummary() {
        SecurityUtils.requireRole(UserRole.ADMIN);

        List<Product> products = productRepository.findAll().stream()
                .filter(product -> product.getStatus() != ProductStatus.DELETED)
                .toList();

        long lowStockCount = products.stream()
                .filter(product -> product.getStock() > 0 && product.getStock() <= LOW_STOCK_THRESHOLD)
                .count();
        long outOfStockCount = products.stream()
                .filter(product -> product.getStock() <= 0)
                .count();
        long totalUnitsInStock = products.stream()
                .mapToLong(product -> product.getStock())
                .sum();

        return AdminInventorySummaryResponseDto.builder()
                .totalSkus(products.size())
                .lowStockCount(lowStockCount)
                .outOfStockCount(outOfStockCount)
                .totalUnitsInStock(totalUnitsInStock)
                .build();
    }

    private AdminInventoryItemResponseDto toInventoryItem(Product product) {
        return AdminInventoryItemResponseDto.builder()
                .productId(product.getId().toString())
                .name(product.getName())
                .sku(product.getSlug())
                .stock(product.getStock())
                .soldCount(product.getSoldCount())
                .status(product.getStatus())
                .primaryImageUrl(resolvePrimaryImageUrl(product.getId()))
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .sellerName(product.getSeller() != null ? product.getSeller().getFullName() : null)
                .build();
    }

    private String resolvePrimaryImageUrl(UUID productId) {
        return productImageRepository.findByProductIdAndIsPrimaryTrue(productId)
                .map(productImage -> productImage.getUrl())
                .orElseGet(() -> productImageRepository.findByProductId(productId).stream()
                        .findFirst()
                        .map(productImage -> productImage.getUrl())
                        .orElse(null));
    }

    private boolean matchesKeyword(Product product, String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return true;
        }
        String pattern = keyword.trim().toLowerCase();
        return product.getName().toLowerCase().contains(pattern)
                || product.getSlug().toLowerCase().contains(pattern);
    }

    private boolean matchesStockFilters(Product product, Boolean lowStockOnly, Boolean outOfStockOnly) {
        if (Boolean.TRUE.equals(outOfStockOnly)) {
            return product.getStock() <= 0;
        }
        if (Boolean.TRUE.equals(lowStockOnly)) {
            return product.getStock() > 0 && product.getStock() <= LOW_STOCK_THRESHOLD;
        }
        return true;
    }

    private int compareByPageable(Product left, Product right, Pageable pageable) {
        if (pageable.getSort().isEmpty()) {
            return Integer.compare(left.getStock(), right.getStock());
        }
        var order = pageable.getSort().iterator().next();
        int direction = order.isAscending() ? 1 : -1;
        return switch (order.getProperty()) {
            case "stock" -> Integer.compare(left.getStock(), right.getStock()) * direction;
            case "soldCount" -> Integer.compare(left.getSoldCount(), right.getSoldCount()) * direction;
            case "name" -> left.getName().compareToIgnoreCase(right.getName()) * direction;
            default -> left.getCreatedAt().compareTo(right.getCreatedAt()) * direction;
        };
    }
}
