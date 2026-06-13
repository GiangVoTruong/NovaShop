package com.backend.features.coupon.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.backend.features.coupon.enums.CouponType;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;
import com.backend.features.coupon.Coupon;
@Getter
@Setter
public class UpdateCouponRequestDto {

    private CouponType type;

    @Positive(message = "Coupon value must be positive")
    private BigDecimal value;

    @PositiveOrZero(message = "Minimum order amount must be zero or positive")
    private BigDecimal minOrderAmount;

    @PositiveOrZero(message = "Maximum discount must be zero or positive")
    private BigDecimal maxDiscount;

    private OffsetDateTime startAt;
    private OffsetDateTime endAt;

    @Positive(message = "Usage limit must be positive")
    private Integer usageLimit;

    private Boolean active;
}
