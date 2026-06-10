package com.backend.dto.orders;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeliverOrderRequestDto {

    @NotBlank
    private String deliveryProofUrl;

    private String trackingCode;
}
