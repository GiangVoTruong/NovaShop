package com.backend.features.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRefreshRequestDto {

    @NotBlank
    private String refreshToken;
}
