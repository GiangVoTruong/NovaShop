package com.backend.dto.orders;

import com.backend.enums.OrderStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateOrderStatusRequestDto {

    @NotNull
    private OrderStatus status;
}
