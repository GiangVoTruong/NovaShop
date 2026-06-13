package com.backend.features.seller.dto;

import com.backend.features.seller.enums.SellerApplicationStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewSellerApplicationRequestDto {

    @NotNull
    private SellerApplicationStatus status;

    @Size(max = 1000)
    private String adminNote;
}
