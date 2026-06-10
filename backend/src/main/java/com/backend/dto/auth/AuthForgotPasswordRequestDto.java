package com.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthForgotPasswordRequestDto {

    @NotBlank
    @Email
    private String email;
}
