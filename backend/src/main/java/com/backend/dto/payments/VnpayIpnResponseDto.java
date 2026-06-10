package com.backend.dto.payments;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VnpayIpnResponseDto {

    private String rspCode;
    private String message;
}
