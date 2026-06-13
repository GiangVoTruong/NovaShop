package com.backend.features.settings.dto;

import java.math.BigDecimal;

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
public class ShopSettingsDto {

    private String shopName;
    private String supportEmail;
    private String supportPhone;
    private BigDecimal shippingFeeDefault;
    private BigDecimal freeShippingThreshold;
    private BigDecimal taxRate;
    private boolean maintenanceMode;
}
