package com.backend.dto.coupons;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.backend.enums.CouponType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateCouponRequestDto {

    @NotBlank(message = "Coupon code is required")
    private String code;

    @NotNull(message = "Coupon type is required")
    private CouponType type;

    @NotNull(message = "Coupon value is required")
    @Positive(message = "Coupon value must be positive")
    private BigDecimal value;

    @PositiveOrZero(message = "Minimum order amount must be zero or positive")
    private BigDecimal minOrderAmount;

    @PositiveOrZero(message = "Maximum discount must be zero or positive")
    private BigDecimal maxDiscount;

    private OffsetDateTime startAt;
    private OffsetDateTime endAt;

    @Positive(message = "Usage limit must be positive")
    private int usageLimit;

    private boolean active = true;
}
