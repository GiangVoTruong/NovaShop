package com.backend.features.payment.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateStripePaymentRequestDto {

    @NotNull
    private UUID orderId;
}
