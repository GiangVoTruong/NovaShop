package com.backend.features.notification.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.backend.features.notification.dto.GetNotificationResponseDto;
import com.backend.features.notification.Notification;

import lombok.RequiredArgsConstructor;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

@Component
@RequiredArgsConstructor
public class NotificationResponseBuilder {

    private final JsonMapper jsonMapper;

    public GetNotificationResponseDto toResponse(Notification notification) {
        return GetNotificationResponseDto.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .metadata(buildMetadata(notification.getTitle(), notification.getMessage()))
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    private Map<String, Object> buildMetadata(String eventKey, String messageJson) {
        Map<String, Object> metadata = new LinkedHashMap<>();
        if (StringUtils.hasText(eventKey)) {
            metadata.put("eventKey", eventKey);
        }
        if (!StringUtils.hasText(messageJson)) {
            return metadata;
        }
        try {
            Map<String, Object> params = jsonMapper.readValue(messageJson, new TypeReference<Map<String, Object>>() {});
            metadata.putAll(params);
        } catch (JacksonException exception) {
            metadata.put("rawMessage", messageJson);
        }
        return metadata;
    }
}
