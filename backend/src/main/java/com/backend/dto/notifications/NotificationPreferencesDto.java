package com.backend.dto.notifications;

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
public class NotificationPreferencesDto {

    @Builder.Default
    private boolean orderEmail = true;

    @Builder.Default
    private boolean promoEmail = true;

    @Builder.Default
    private boolean securitySms = false;

    @Builder.Default
    private boolean deliveryPush = true;
}
