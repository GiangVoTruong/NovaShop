package com.backend.dto.orders;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import com.backend.enums.OrderStatus;
import com.backend.enums.PaymentMethodType;
import com.backend.enums.PaymentStatusType;

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
public class GetOrderResponseDto {

    private UUID id;
    private UUID userId;
    private BigDecimal totalAmount;
    private BigDecimal finalAmount;
    private OrderStatus status;
    private PaymentMethodType paymentMethod;
    private PaymentStatusType paymentStatus;
    private List<GetOrderItemResponseDto> items;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
