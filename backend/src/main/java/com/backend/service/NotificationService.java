package com.backend.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.server.ResponseStatusException;

import com.backend.constants.NotificationI18nKeys;
import com.backend.dto.notifications.GetNotificationResponseDto;
import com.backend.entity.Notification;
import com.backend.entity.ShopOrder;
import com.backend.entity.User;
import com.backend.enums.NotificationType;
import com.backend.enums.UserRole;
import com.backend.repository.NotificationRepository;
import com.backend.repository.UserRepository;
import com.backend.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.json.JsonMapper;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final String NOTIFICATION_USER_DESTINATION = "/queue/notifications";

    private static final List<UserRole> STAFF_ROLES = List.of(UserRole.ADMIN, UserRole.SELLER);

    private final NotificationRepository notificationRepository;
    private final NotificationResponseBuilder notificationResponseBuilder;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final JsonMapper jsonMapper;

    @Transactional
    public GetNotificationResponseDto create(User user, NotificationType type, String title, String message) {
        Notification saved = notificationRepository.save(Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .build());
        GetNotificationResponseDto response = notificationResponseBuilder.toResponse(saved);
        String userId = user.getId().toString();

        // Push sau khi commit — tránh FE refetch mà DB chưa có bản ghi mới
        TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                messagingTemplate.convertAndSendToUser(
                        userId,
                        NOTIFICATION_USER_DESTINATION,
                        response);
            }
        });

        return response;
    }

    @Transactional
    public GetNotificationResponseDto createI18n(
            User user,
            NotificationType type,
            String eventKey,
            Map<String, Object> params) {
        try {
            String messageJson = jsonMapper.writeValueAsString(params);
            if (notificationRepository.existsByUser_IdAndTitleAndMessage(user.getId(), eventKey, messageJson)) {
                return notificationRepository
                        .findTopByUser_IdAndTitleAndMessageOrderByCreatedAtDesc(user.getId(), eventKey, messageJson)
                        .map(notificationResponseBuilder::toResponse)
                        .orElseGet(() -> create(user, type, eventKey, messageJson));
            }
            return create(user, type, eventKey, messageJson);
        } catch (JacksonException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to serialize notification params");
        }
    }

    @Transactional
    public void notifyStaffNewOrder(ShopOrder order) {
        String customerName = order.getUser().getFullName();
        Map<String, Object> params = Map.of(
                "orderId", order.getId().toString(),
                "customerName", customerName);

        for (User staffUser : userRepository.findByRoleIn(STAFF_ROLES)) {
            if (staffUser.getId().equals(order.getUser().getId())) {
                continue;
            }
            createI18n(staffUser, NotificationType.ORDER_STATUS, NotificationI18nKeys.NEW_ORDER_RECEIVED, params);
        }
    }

    @Transactional(readOnly = true)
    public Page<GetNotificationResponseDto> getNotificationsByUserId(UUID userId, Pageable pageable) {
        assertCurrentUser(userId);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(notificationResponseBuilder::toResponse);
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
        notification.setIsRead(true);
        return notificationResponseBuilder.toResponse(notificationRepository.save(notification));
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
