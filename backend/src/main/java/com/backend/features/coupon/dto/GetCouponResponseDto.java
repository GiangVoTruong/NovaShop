package com.backend.features.coupon.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

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
public class GetCouponResponseDto {

    private UUID id;
    private String code;
    private CouponType type;
    private BigDecimal value;
    private BigDecimal minOrderAmount;
    private BigDecimal maxDiscount;
    private OffsetDateTime startAt;
    private OffsetDateTime endAt;
    private int usageLimit;
    private int usedCount;
    private boolean active;
}
