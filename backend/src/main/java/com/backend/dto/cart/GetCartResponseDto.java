package com.backend.dto.cart;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

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
public class GetCartResponseDto {

    private UUID id;
    private List<GetCartItemResponseDto> items;
    private BigDecimal totalAmount;
    private Integer itemCount;
}
