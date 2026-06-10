package com.backend.dto.notifications;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

import com.backend.enums.NotificationType;

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
public class GetNotificationResponseDto {

    private UUID id;
    private NotificationType type;
    private String title;
    private String message;
    private Map<String, Object> metadata;
    private Boolean isRead;
    private OffsetDateTime createdAt;
}
