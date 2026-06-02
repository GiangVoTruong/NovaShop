package com.backend.dto.coupons;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ValidateCouponRequestDto {

    @NotBlank(message = "Coupon code is required")
    private String code;

    @NotNull(message = "Cart total is required")
    @PositiveOrZero(message = "Cart total must be zero or positive")
    private BigDecimal cartTotal;
}
