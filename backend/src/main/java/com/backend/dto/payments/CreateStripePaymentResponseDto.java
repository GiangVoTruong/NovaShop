package com.backend.dto.payments;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateStripePaymentResponseDto {

    private String checkoutUrl;
    private String sessionId;
}
