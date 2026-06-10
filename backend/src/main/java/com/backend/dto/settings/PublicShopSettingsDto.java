package com.backend.dto.settings;

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
public class PublicShopSettingsDto {

    private String shopName;
    private boolean maintenanceMode;
    private String supportEmail;
    private String supportPhone;
}
