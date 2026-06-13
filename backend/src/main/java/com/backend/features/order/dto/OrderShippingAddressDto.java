package com.backend.features.order.dto;

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
public class OrderShippingAddressDto {

    private UUID addressId;
    private String fullName;
    private String phone;
    private String province;
    private String district;
    private String ward;
    private String detail;
}
