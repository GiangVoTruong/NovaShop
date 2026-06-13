package com.backend.features.order.dto;

import com.backend.features.order.enums.OrderStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderStatusRequestDto {

    @NotNull
    private OrderStatus status;
}
