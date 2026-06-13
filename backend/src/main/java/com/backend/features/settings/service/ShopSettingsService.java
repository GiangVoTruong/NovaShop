package com.backend.features.settings.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.backend.features.settings.dto.PublicShopSettingsDto;
import com.backend.features.settings.dto.ShopSettingsDto;
import com.backend.common.enums.UserRole;
import com.backend.features.auth.security.SecurityUtils;

@Service
public class ShopSettingsService {

    private ShopSettingsDto settings = ShopSettingsDto.builder()
            .shopName("NovaShop")
            .supportEmail("support@novashop.vn")
            .supportPhone("19001234")
            .shippingFeeDefault(new BigDecimal("30000"))
            .freeShippingThreshold(new BigDecimal("500000"))
            .taxRate(BigDecimal.ZERO)
            .maintenanceMode(false)
            .build();

    public ShopSettingsDto getSettings() {
        SecurityUtils.requireRole(UserRole.ADMIN);
        return settings;
    }

    public PublicShopSettingsDto getPublicSettings() {
        return PublicShopSettingsDto.builder()
                .shopName(settings.getShopName())
                .maintenanceMode(settings.isMaintenanceMode())
                .supportEmail(settings.getSupportEmail())
                .supportPhone(settings.getSupportPhone())
                .build();
    }

    public ShopSettingsDto updateSettings(ShopSettingsDto request) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        if (request.getShopName() != null) {
            settings.setShopName(request.getShopName());
        }
        if (request.getSupportEmail() != null) {
            settings.setSupportEmail(request.getSupportEmail());
        }
        if (request.getSupportPhone() != null) {
            settings.setSupportPhone(request.getSupportPhone());
        }
        if (request.getShippingFeeDefault() != null) {
            settings.setShippingFeeDefault(request.getShippingFeeDefault());
        }
        if (request.getFreeShippingThreshold() != null) {
            settings.setFreeShippingThreshold(request.getFreeShippingThreshold());
        }
        if (request.getTaxRate() != null) {
            settings.setTaxRate(request.getTaxRate());
        }
        settings.setMaintenanceMode(request.isMaintenanceMode());
        return settings;
    }
}
