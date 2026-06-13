package com.backend.features.payment.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateVnpayPaymentResponseDto {

    private String paymentUrl;
    private String txnRef;
}
