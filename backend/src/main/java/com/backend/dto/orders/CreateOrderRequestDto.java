package com.backend.dto.orders;

import com.backend.enums.PaymentMethodType;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOrderRequestDto {

    @NotNull
    private PaymentMethodType paymentMethod;
}
