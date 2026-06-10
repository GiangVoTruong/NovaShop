package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.settings.PublicShopSettingsDto;
import com.backend.service.ShopSettingsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
@SecurityRequirements
@Tag(name = "settings")
public class SettingsController {

    private final ShopSettingsService shopSettingsService;

    @GetMapping("/public")
    @Operation(
            summary = "Cài đặt shop công khai",
            description = "Trả về thông tin shop và chế độ bảo trì — không cần đăng nhập.")
    public ResponseEntity<ApiResponse<PublicShopSettingsDto>> getPublicSettings() {
        return ApiResponses.ok(shopSettingsService.getPublicSettings(), "Public settings loaded");
    }
}
