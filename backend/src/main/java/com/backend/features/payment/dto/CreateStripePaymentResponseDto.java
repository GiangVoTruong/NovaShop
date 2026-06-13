package com.backend.features.payment.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateStripePaymentResponseDto {

    private String checkoutUrl;
    private String sessionId;
}
