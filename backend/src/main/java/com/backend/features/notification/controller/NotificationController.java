package com.backend.features.notification.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.notification.dto.GetNotificationResponseDto;
import com.backend.features.notification.service.NotificationService;
import com.backend.common.util.PaginationUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users/{userId}/notifications")
@RequiredArgsConstructor
@Tag(name = "notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Danh sách thông báo theo user", description = "Lấy thông báo của userId (phải trùng user đang đăng nhập).")
    public ResponseEntity<ApiResponse<List<GetNotificationResponseDto>>> getNotificationsByUserId(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<GetNotificationResponseDto> notificationPage = notificationService.getNotificationsByUserId(
                userId,
                PaginationUtils.toPageableOneBased(page, size, "createdAt", "desc"));
        return ApiResponses.okPage(notificationPage, "Notifications loaded");
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Số thông báo chưa đọc theo user")
    public ResponseEntity<ApiResponse<Long>> getUnreadCountByUserId(@PathVariable UUID userId) {
        return ApiResponses.ok(notificationService.getUnreadCountByUserId(userId), "Unread count loaded");
    }

    @PatchMapping("/{notificationId}/read")
    @Operation(summary = "Đánh dấu một thông báo đã đọc")
    public ResponseEntity<ApiResponse<GetNotificationResponseDto>> markAsRead(
            @PathVariable UUID userId,
            @PathVariable UUID notificationId) {
        return ApiResponses.ok(
                notificationService.markAsRead(userId, notificationId),
                "Notification marked as read");
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Đánh dấu tất cả thông báo của user đã đọc")
    public ResponseEntity<ApiResponse<Void>> markAllAsReadByUserId(@PathVariable UUID userId) {
        notificationService.markAllAsReadByUserId(userId);
        return ApiResponses.okMessage("All notifications marked as read");
    }
}
