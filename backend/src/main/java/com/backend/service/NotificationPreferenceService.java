package com.backend.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.backend.dto.notifications.NotificationPreferencesDto;
import com.backend.security.SecurityUtils;

@Service
public class NotificationPreferenceService {

    private final Map<UUID, NotificationPreferencesDto> preferencesByUser = new ConcurrentHashMap<>();

    public NotificationPreferencesDto getMyPreferences() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return preferencesByUser.getOrDefault(userId, defaultPreferences());
    }

    public NotificationPreferencesDto updateMyPreferences(NotificationPreferencesDto request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        NotificationPreferencesDto saved = NotificationPreferencesDto.builder()
                .orderEmail(request.isOrderEmail())
                .promoEmail(request.isPromoEmail())
                .securitySms(request.isSecuritySms())
                .deliveryPush(request.isDeliveryPush())
                .build();
        preferencesByUser.put(userId, saved);
        return saved;
    }

    private NotificationPreferencesDto defaultPreferences() {
        return NotificationPreferencesDto.builder().build();
    }
}
