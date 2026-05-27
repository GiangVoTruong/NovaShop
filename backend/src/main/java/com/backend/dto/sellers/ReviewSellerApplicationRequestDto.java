package com.backend.dto.sellers;

import com.backend.enums.SellerApplicationStatus;

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
