package com.backend.features.seller.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.backend.features.seller.enums.SellerApplicationStatus;

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
public class GetSellerApplicationResponseDto {

    private UUID id;
    private UUID userId;
    private String userEmail;
    private String userFullName;
    private String shopName;
    private String description;
    private SellerApplicationStatus status;
    private String adminNote;
    private UUID reviewedBy;
    private OffsetDateTime createdAt;
    private OffsetDateTime reviewedAt;
}
