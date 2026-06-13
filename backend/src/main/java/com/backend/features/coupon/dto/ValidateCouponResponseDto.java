package com.backend.features.coupon.dto;

import java.math.BigDecimal;

import com.backend.features.coupon.enums.CouponType;

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
public class ValidateCouponResponseDto {

    private boolean valid;
    private BigDecimal discountAmount;
    private String message;
    private CouponSummaryDto coupon;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CouponSummaryDto {
        private String code;
        private CouponType type;
        private BigDecimal value;
    }
}
