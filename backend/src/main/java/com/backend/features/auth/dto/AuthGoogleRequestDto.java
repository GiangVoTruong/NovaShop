package com.backend.features.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthGoogleRequestDto {

    @NotBlank
    private String idToken;
}
