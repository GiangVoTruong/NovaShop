package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.auth.AuthLoginRequestDto;
import com.backend.dto.auth.ChangePasswordRequestDto;
import com.backend.dto.auth.AuthLoginResponseDto;
import com.backend.dto.auth.AuthRefreshRequestDto;
import com.backend.dto.auth.AuthRegisterRequestDto;
import com.backend.dto.auth.AuthRegisterResponseDto;
import com.backend.dto.auth.AuthResendVerificationRequestDto;
import com.backend.dto.auth.AuthVerifyEmailRequestDto;
import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.common.MessageResponseDto;
import com.backend.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@SecurityRequirements
@Tag(name = "auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(
            summary = "Đăng nhập",
            description = "Xác thực email và mật khẩu để cấp access token và refresh token.")
    public ResponseEntity<ApiResponse<AuthLoginResponseDto>> login(@Valid @RequestBody AuthLoginRequestDto request) {
        return ApiResponses.ok(authService.login(request), "Login successful");
    }

    @PostMapping("/refresh")
    @Operation(
            summary = "Làm mới token",
            description = "Dùng refresh token hợp lệ để lấy cặp token mới.")
    public ResponseEntity<ApiResponse<AuthLoginResponseDto>> refresh(@Valid @RequestBody AuthRefreshRequestDto request) {
        return ApiResponses.ok(authService.refresh(request), "Token refreshed successfully");
    }

    @PostMapping("/register")
    @Operation(
            summary = "Đăng ký tài khoản",
            description = "Tạo tài khoản người dùng mới và gửi thông tin xác minh email.")
    public ResponseEntity<ApiResponse<AuthRegisterResponseDto>> register(@Valid @RequestBody AuthRegisterRequestDto request) {
        return ApiResponses.created(authService.register(request), "Registration successful");
    }

    @PostMapping("/verify-email")
    @Operation(
            summary = "Xác minh email",
            description = "Xác minh mã OTP/email code và kích hoạt tài khoản.")
    public ResponseEntity<ApiResponse<AuthLoginResponseDto>> verifyEmail(@Valid @RequestBody AuthVerifyEmailRequestDto request) {
        return ApiResponses.ok(authService.verifyEmail(request), "Email verified successfully");
    }

    @PostMapping("/change-password")
    @Operation(
            summary = "Đổi mật khẩu",
            description = "Đổi mật khẩu cho người dùng đang đăng nhập.")
    public ResponseEntity<ApiResponse<MessageResponseDto>> changePassword(
            @Valid @RequestBody ChangePasswordRequestDto request) {
        authService.changePassword(request);
        return ApiResponses.ok(
                MessageResponseDto.builder().message("Password changed successfully").build(),
                "Password changed successfully");
    }

    @PostMapping("/resend-verification")
    @Operation(
            summary = "Gửi lại mã xác minh",
            description = "Gửi lại mã xác minh email cho tài khoản chưa kích hoạt.")
    public ResponseEntity<ApiResponse<Void>> resendVerification(@Valid @RequestBody AuthResendVerificationRequestDto request) {
        authService.resendVerification(request);
        return ApiResponses.okMessage("Verification code sent successfully");
    }
}

