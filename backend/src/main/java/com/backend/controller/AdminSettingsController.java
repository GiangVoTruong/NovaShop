package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.settings.ShopSettingsDto;
import com.backend.service.ShopSettingsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
@Tag(name = "admin-settings")
public class AdminSettingsController {

    private final ShopSettingsService shopSettingsService;

    @GetMapping
    @Operation(summary = "Lấy cài đặt shop", description = "Trả về cấu hình shop — role ADMIN.")
    public ResponseEntity<ApiResponse<ShopSettingsDto>> getSettings() {
        return ApiResponses.ok(shopSettingsService.getSettings(), "Lấy cài đặt shop thành công");
    }

    @PutMapping
    @Operation(summary = "Cập nhật cài đặt shop", description = "Cập nhật cấu hình shop — role ADMIN.")
    public ResponseEntity<ApiResponse<ShopSettingsDto>> updateSettings(@RequestBody ShopSettingsDto request) {
        return ApiResponses.ok(shopSettingsService.updateSettings(request), "Cập nhật cài đặt shop thành công");
    }
}
