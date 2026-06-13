package com.backend.features.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.features.auth.dto.AuthForgotPasswordRequestDto;
import com.backend.features.auth.dto.AuthGoogleRequestDto;
import com.backend.features.auth.dto.AuthLoginRequestDto;
import com.backend.features.auth.dto.ChangePasswordRequestDto;
import com.backend.features.auth.dto.AuthLoginResponseDto;
import com.backend.features.auth.dto.AuthRefreshRequestDto;
import com.backend.features.auth.dto.AuthRegisterRequestDto;
import com.backend.features.auth.dto.AuthRegisterResponseDto;
import com.backend.features.auth.dto.AuthResetPasswordRequestDto;
import com.backend.features.auth.dto.AuthResendVerificationRequestDto;
import com.backend.features.auth.dto.AuthVerifyEmailRequestDto;
import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.common.dto.MessageResponseDto;
import com.backend.features.auth.service.AuthService;
import com.backend.features.auth.service.PasswordResetService;

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
    private final PasswordResetService passwordResetService;

    @PostMapping("/login")
    @Operation(
            summary = "Đăng nhập",
            description = "Xác thực email và mật khẩu để cấp access token và refresh token.")
    public ResponseEntity<ApiResponse<AuthLoginResponseDto>> login(@Valid @RequestBody AuthLoginRequestDto request) {
        return ApiResponses.ok(authService.login(request), "Login successful");
    }

    @PostMapping("/google")
    @Operation(
            summary = "Đăng nhập Google",
            description = "Xác thực Google ID token và cấp JWT giống login thường.")
    public ResponseEntity<ApiResponse<AuthLoginResponseDto>> loginWithGoogle(
            @Valid @RequestBody AuthGoogleRequestDto request) {
        return ApiResponses.ok(authService.loginWithGoogle(request), "Google login successful");
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

    @PostMapping("/forgot-password")
    @Operation(
            summary = "Quên mật khẩu",
            description = "Gửi OTP reset mật khẩu qua email nếu tài khoản tồn tại.")
    public ResponseEntity<ApiResponse<MessageResponseDto>> forgotPassword(
            @Valid @RequestBody AuthForgotPasswordRequestDto request) {
        passwordResetService.forgotPassword(request);
        return ApiResponses.ok(
                MessageResponseDto.builder().message(passwordResetService.getForgotPasswordMessage()).build(),
                passwordResetService.getForgotPasswordMessage());
    }

    @PostMapping("/reset-password")
    @Operation(
            summary = "Đặt lại mật khẩu",
            description = "Xác nhận OTP và đặt mật khẩu mới.")
    public ResponseEntity<ApiResponse<MessageResponseDto>> resetPassword(
            @Valid @RequestBody AuthResetPasswordRequestDto request) {
        passwordResetService.resetPassword(request);
        return ApiResponses.ok(
                MessageResponseDto.builder().message("Password reset successful").build(),
                "Password reset successful");
    }
}

