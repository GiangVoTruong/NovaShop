package com.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.dto.coupons.CreateCouponRequestDto;
import com.backend.dto.coupons.GetCouponResponseDto;
import com.backend.dto.coupons.UpdateCouponRequestDto;
import com.backend.dto.coupons.ValidateCouponResponseDto;
import com.backend.entity.Coupon;
import com.backend.enums.CouponType;
import com.backend.enums.UserRole;
import com.backend.repository.CouponRepository;
import com.backend.security.SecurityUtils;
import com.github.f4b6a3.uuid.UuidCreator;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CouponService {

    private static final String COUPON_NOT_FOUND = "Coupon not found";
    private static final String COUPON_CODE_EXISTS = "Coupon code already exists";
    private static final String INVALID_COUPON = "Invalid or expired coupon code";

    private final CouponRepository couponRepository;

    @PostConstruct
    void seedCoupons() {
        OffsetDateTime now = OffsetDateTime.now();
        saveSeedIfAbsent("NOVA20", CouponType.PERCENT, new BigDecimal("20"), new BigDecimal("500000"), null,
                now.minusDays(1), now.plusMonths(6), 1000, true);
        saveSeedIfAbsent("FREESHIP", CouponType.FIXED, new BigDecimal("30000"), BigDecimal.ZERO, null,
                now.minusDays(1), now.plusYears(1), 5000, true);
        saveSeedIfAbsent("TECHFEST", CouponType.PERCENT, new BigDecimal("12"), new BigDecimal("2000000"), null,
                now.minusDays(1), now.plusMonths(3), 500, true);
    }

    @Transactional(readOnly = true)
    public ValidateCouponResponseDto validate(String code, BigDecimal cartTotal) {
        Coupon coupon = findActiveCoupon(code).orElse(null);
        if (coupon == null) {
            return ValidateCouponResponseDto.builder()
                    .valid(false)
                    .discountAmount(BigDecimal.ZERO)
                    .message(INVALID_COUPON)
                    .build();
        }

        if (cartTotal.compareTo(coupon.getMinOrderAmount()) < 0) {
            return ValidateCouponResponseDto.builder()
                    .valid(false)
                    .discountAmount(BigDecimal.ZERO)
                    .message("Order total does not meet minimum amount for this coupon")
                    .build();
        }

        BigDecimal discountAmount = calculateDiscount(coupon, cartTotal);
        return ValidateCouponResponseDto.builder()
                .valid(true)
                .discountAmount(discountAmount)
                .message("Coupon applied successfully")
                .coupon(ValidateCouponResponseDto.CouponSummaryDto.builder()
                        .code(coupon.getCode())
                        .type(coupon.getType())
                        .value(coupon.getValue())
                        .build())
                .build();
    }

    @Transactional
    public BigDecimal computeDiscountForCheckout(String code, BigDecimal cartTotal) {
        ValidateCouponResponseDto validation = validate(code, cartTotal);
        if (!validation.isValid()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, validation.getMessage());
        }
        incrementUsage(normalizeCode(code));
        return validation.getDiscountAmount();
    }

    @Transactional(readOnly = true)
    public List<GetCouponResponseDto> getAllCouponsAdmin() {
        SecurityUtils.requireRole(UserRole.ADMIN);
        return couponRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public GetCouponResponseDto createCoupon(CreateCouponRequestDto request) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        String normalizedCode = normalizeCode(request.getCode());
        if (couponRepository.existsByCodeIgnoreCase(normalizedCode)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, COUPON_CODE_EXISTS);
        }

        OffsetDateTime now = OffsetDateTime.now();
        Coupon coupon = Coupon.builder()
                .id(UuidCreator.getTimeOrderedEpoch())
                .code(normalizedCode)
                .type(request.getType())
                .value(request.getValue())
                .minOrderAmount(defaultAmount(request.getMinOrderAmount()))
                .maxDiscount(request.getMaxDiscount())
                .startAt(request.getStartAt())
                .endAt(request.getEndAt())
                .usageLimit(request.getUsageLimit())
                .usedCount(0)
                .isActive(request.isActive())
                .createdAt(now)
                .updatedAt(now)
                .build();
        return toDto(couponRepository.save(coupon));
    }

    @Transactional
    public GetCouponResponseDto updateCoupon(UUID couponId, UpdateCouponRequestDto request) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        Coupon coupon = findById(couponId);

        if (request.getType() != null) {
            coupon.setType(request.getType());
        }
        if (request.getValue() != null) {
            coupon.setValue(request.getValue());
        }
        if (request.getMinOrderAmount() != null) {
            coupon.setMinOrderAmount(request.getMinOrderAmount());
        }
        if (request.getMaxDiscount() != null) {
            coupon.setMaxDiscount(request.getMaxDiscount());
        }
        if (request.getStartAt() != null) {
            coupon.setStartAt(request.getStartAt());
        }
        if (request.getEndAt() != null) {
            coupon.setEndAt(request.getEndAt());
        }
        if (request.getUsageLimit() != null) {
            coupon.setUsageLimit(request.getUsageLimit());
        }
        if (request.getActive() != null) {
            coupon.setIsActive(request.getActive());
        }
        coupon.setUpdatedAt(OffsetDateTime.now());
        return toDto(couponRepository.save(coupon));
    }

    @Transactional
    public void deleteCoupon(UUID couponId) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        Coupon coupon = findById(couponId);
        couponRepository.delete(coupon);
    }

    private Coupon findById(UUID couponId) {
        return couponRepository.findById(couponId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, COUPON_NOT_FOUND));
    }

    private Optional<Coupon> findActiveCoupon(String code) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(normalizeCode(code)).orElse(null);
        if (coupon == null || !Boolean.TRUE.equals(coupon.getIsActive())) {
            return Optional.empty();
        }
        OffsetDateTime now = OffsetDateTime.now();
        if (coupon.getStartAt() != null && now.isBefore(coupon.getStartAt())) {
            return Optional.empty();
        }
        if (coupon.getEndAt() != null && now.isAfter(coupon.getEndAt())) {
            return Optional.empty();
        }
        if (coupon.getUsageLimit() > 0 && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return Optional.empty();
        }
        return Optional.of(coupon);
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal cartTotal) {
        BigDecimal discount = coupon.getType() == CouponType.PERCENT
                ? cartTotal.multiply(coupon.getValue()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP)
                : coupon.getValue();
        if (coupon.getMaxDiscount() != null && discount.compareTo(coupon.getMaxDiscount()) > 0) {
            discount = coupon.getMaxDiscount();
        }
        if (discount.compareTo(cartTotal) > 0) {
            return cartTotal;
        }
        return discount;
    }

    private void incrementUsage(String normalizedCode) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(normalizedCode).orElse(null);
        if (coupon != null) {
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            coupon.setUpdatedAt(OffsetDateTime.now());
            couponRepository.save(coupon);
        }
    }

    private void saveSeedIfAbsent(
            String code,
            CouponType type,
            BigDecimal value,
            BigDecimal minOrder,
            BigDecimal maxDiscount,
            OffsetDateTime startAt,
            OffsetDateTime endAt,
            int usageLimit,
            boolean active) {
        String normalizedCode = normalizeCode(code);
        if (couponRepository.existsByCodeIgnoreCase(normalizedCode)) {
            return;
        }
        OffsetDateTime now = OffsetDateTime.now();
        couponRepository.save(Coupon.builder()
                .id(UuidCreator.getTimeOrderedEpoch())
                .code(normalizedCode)
                .type(type)
                .value(value)
                .minOrderAmount(minOrder)
                .maxDiscount(maxDiscount)
                .startAt(startAt)
                .endAt(endAt)
                .usageLimit(usageLimit)
                .usedCount(0)
                .isActive(active)
                .createdAt(now)
                .updatedAt(now)
                .build());
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    private BigDecimal defaultAmount(BigDecimal amount) {
        return amount == null ? BigDecimal.ZERO : amount;
    }

    private GetCouponResponseDto toDto(Coupon coupon) {
        return GetCouponResponseDto.builder()
                .id(coupon.getId())
                .code(coupon.getCode())
                .type(coupon.getType())
                .value(coupon.getValue())
                .minOrderAmount(coupon.getMinOrderAmount())
                .maxDiscount(coupon.getMaxDiscount())
                .startAt(coupon.getStartAt())
                .endAt(coupon.getEndAt())
                .usageLimit(coupon.getUsageLimit())
                .usedCount(coupon.getUsedCount())
                .active(Boolean.TRUE.equals(coupon.getIsActive()))
                .build();
    }
}
