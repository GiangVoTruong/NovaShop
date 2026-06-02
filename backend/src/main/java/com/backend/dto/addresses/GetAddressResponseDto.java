package com.backend.dto.addresses;

import java.time.OffsetDateTime;
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
public class GetAddressResponseDto {

    private UUID id;
    private String label;
    private String recipientName;
    private String phone;
    private String line1;
    private String ward;
    private String district;
    private String city;
    private Boolean isDefault;
    private OffsetDateTime createdAt;
}
