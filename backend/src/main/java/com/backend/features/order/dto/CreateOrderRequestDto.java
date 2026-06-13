package com.backend.features.order.dto;

import java.util.UUID;

import com.backend.features.payment.enums.PaymentMethodType;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOrderRequestDto {

    @NotNull
    private PaymentMethodType paymentMethod;

    @NotNull(message = "Address is required")
    private UUID addressId;

    @Size(max = 50)
    private String couponCode;

    @Size(max = 500)
    private String note;
}
