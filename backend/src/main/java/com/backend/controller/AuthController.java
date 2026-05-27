package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.auth.AuthLoginRequestDto;
import com.backend.dto.auth.AuthLoginResponseDto;
import com.backend.dto.auth.AuthRefreshRequestDto;
import com.backend.dto.auth.AuthRegisterRequestDto;
import com.backend.dto.auth.AuthRegisterResponseDto;
import com.backend.dto.auth.AuthResendVerificationRequestDto;
import com.backend.dto.auth.AuthVerifyEmailRequestDto;
import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthLoginResponseDto>> login(@Valid @RequestBody AuthLoginRequestDto request) {
        return ApiResponses.ok(authService.login(request), "Login successful");
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthLoginResponseDto>> refresh(@Valid @RequestBody AuthRefreshRequestDto request) {
        return ApiResponses.ok(authService.refresh(request), "Token refreshed successfully");
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthRegisterResponseDto>> register(@Valid @RequestBody AuthRegisterRequestDto request) {
        return ApiResponses.created(authService.register(request), "Registration successful");
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<AuthLoginResponseDto>> verifyEmail(@Valid @RequestBody AuthVerifyEmailRequestDto request) {
        return ApiResponses.ok(authService.verifyEmail(request), "Email verified successfully");
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerification(@Valid @RequestBody AuthResendVerificationRequestDto request) {
        authService.resendVerification(request);
        return ApiResponses.okMessage("Verification code sent successfully");
    }
}
