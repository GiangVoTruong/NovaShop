package com.backend.features.notification.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.notification.dto.NotificationPreferencesDto;
import com.backend.features.notification.service.NotificationPreferenceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/me/notifications/preferences")
@RequiredArgsConstructor
@Tag(name = "notification-preferences")
public class NotificationPreferenceController {

    private final NotificationPreferenceService notificationPreferenceService;

    @GetMapping
    @Operation(summary = "Lấy cài đặt thông báo", description = "Trả về preferences thông báo của user đang đăng nhập.")
    public ResponseEntity<ApiResponse<NotificationPreferencesDto>> getPreferences() {
        return ApiResponses.ok(notificationPreferenceService.getMyPreferences(), "Lấy preferences thành công");
    }

    @PatchMapping
    @Operation(summary = "Cập nhật cài đặt thông báo", description = "Cập nhật preferences thông báo của user đang đăng nhập.")
    public ResponseEntity<ApiResponse<NotificationPreferencesDto>> updatePreferences(
            @RequestBody NotificationPreferencesDto request) {
        return ApiResponses.ok(
                notificationPreferenceService.updateMyPreferences(request),
                "Cập nhật preferences thành công");
    }
}
