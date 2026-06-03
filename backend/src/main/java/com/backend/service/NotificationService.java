package com.backend.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.dto.notifications.GetNotificationResponseDto;
import com.backend.entity.Notification;
import com.backend.entity.User;
import com.backend.enums.NotificationType;
import com.backend.mapper.NotificationMapper;
import com.backend.repository.NotificationRepository;
import com.backend.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final String NOTIFICATION_NOT_FOUND = "Notification not found";

    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Transactional
    public GetNotificationResponseDto create(User user, NotificationType type, String title, String message) {
        Notification saved = notificationRepository.save(Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .build());
        return notificationMapper.toDto(saved);
    }

    @Transactional(readOnly = true)
    public Page<GetNotificationResponseDto> getMyNotifications(Pageable pageable) {
        UUID userId = SecurityUtils.getCurrentUserId();
        return notificationRepository.findByUser_IdOrderByCreatedAtDesc(userId, pageable)
                .map(notificationMapper::toDto);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return notificationRepository.countByUser_IdAndIsReadFalse(userId);
    }

    @Transactional
    public GetNotificationResponseDto markAsRead(UUID notificationId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        Notification notification = notificationRepository.findByIdAndUser_Id(notificationId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, NOTIFICATION_NOT_FOUND));
        notification.setIsRead(true);
        return notificationMapper.toDto(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsRead() {
        UUID userId = SecurityUtils.getCurrentUserId();
        notificationRepository.markAllAsReadByUserId(userId);
    }
}
