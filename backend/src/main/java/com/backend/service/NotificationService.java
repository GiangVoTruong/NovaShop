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
    public Page<GetNotificationResponseDto> getNotificationsByUserId(UUID userId, Pageable pageable) {
        assertCurrentUser(userId);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(notificationMapper::toDto);
    }

    @Transactional(readOnly = true)
    public long getUnreadCountByUserId(UUID userId) {
        assertCurrentUser(userId);
        return notificationRepository.countUnreadByUserId(userId);
    }

    @Transactional
    public GetNotificationResponseDto markAsRead(UUID userId, UUID notificationId) {
        assertCurrentUser(userId);
        Notification notification = notificationRepository.findByIdAndUserId(notificationId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, NOTIFICATION_NOT_FOUND));
        notification.setIsRead(true);
        return notificationMapper.toDto(notificationRepository.save(notification));
    }

    @Transactional
    public void markAllAsReadByUserId(UUID userId) {
        assertCurrentUser(userId);
        notificationRepository.markAllAsReadByUserId(userId);
    }

    private void assertCurrentUser(UUID userId) {
        if (!SecurityUtils.getCurrentUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
    }
}
