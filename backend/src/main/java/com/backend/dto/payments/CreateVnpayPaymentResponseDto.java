package com.backend.dto.payments;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CreateVnpayPaymentResponseDto {

    private String paymentUrl;
    private String txnRef;
}
