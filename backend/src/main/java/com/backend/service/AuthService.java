package com.backend.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.dto.auth.AuthLoginRequestDto;
import com.backend.dto.auth.AuthLoginResponseDto;
import com.backend.dto.auth.AuthRefreshRequestDto;
import com.backend.dto.auth.AuthRegisterRequestDto;
import com.backend.dto.auth.AuthRegisterResponseDto;
import com.backend.dto.auth.AuthResendVerificationRequestDto;
import com.backend.dto.auth.AuthVerifyEmailRequestDto;
import com.backend.entity.User;
import com.backend.enums.UserRole;
import com.backend.repository.UserRepository;
import com.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String INVALID_CREDENTIALS = "Invalid email or password";
    private static final String REGISTER_SUCCESS = "Registration successful. Please verify your email with the OTP sent to your inbox.";
    private static final String EMAIL_ALREADY_REGISTERED = "Email already registered";
    private static final String EMAIL_NOT_VERIFIED = "Email not verified. Please check your inbox.";
    private static final String ACCOUNT_DISABLED = "Account is disabled";
    private static final String INVALID_REFRESH_TOKEN = "Invalid refresh token";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailVerificationService emailVerificationService;
    private final PermissionService permissionService;

    // --- Register & verification ---
    @Transactional
    public AuthRegisterResponseDto register(AuthRegisterRequestDto request) {
        String email = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, EMAIL_ALREADY_REGISTERED);
        }

        User savedUser = userRepository.save(buildCustomerUser(request, email));
        emailVerificationService.sendVerificationForUser(savedUser);

        return AuthRegisterResponseDto.builder()
                .message(REGISTER_SUCCESS)
                .build();
    }

    @Transactional
    public AuthLoginResponseDto verifyEmail(AuthVerifyEmailRequestDto request) {
        User user = emailVerificationService.verifyEmail(request.getEmail(), request.getOtp());
        return buildAuthResponse(user);
    }

    @Transactional
    public void resendVerification(AuthResendVerificationRequestDto request) {
        emailVerificationService.resendVerification(request.getEmail());
    }

    // --- Login ---
    @Transactional(readOnly = true)
    public AuthLoginResponseDto refresh(AuthRefreshRequestDto request) {
        if (!jwtService.isTokenValid(request.getRefreshToken())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_REFRESH_TOKEN);
        }

        User user = userRepository.findById(jwtService.extractPrincipal(request.getRefreshToken()).userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_REFRESH_TOKEN));

        assertAccountActive(user);
        return buildAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthLoginResponseDto login(AuthLoginRequestDto request) {
        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.getEmail()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_CREDENTIALS));

        assertAccountActive(user);

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_CREDENTIALS);
        }

        return buildAuthResponse(user);
    }

    // --- Private helpers ---
    private User buildCustomerUser(AuthRegisterRequestDto request, String email) {
        OffsetDateTime now = OffsetDateTime.now();
        return User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(UserRole.CUSTOMER)
                .isActive(false)
                .createdAt(now)
                .updatedAt(now)
                .build();
    }

    private void assertAccountActive(User user) {
        if (Boolean.TRUE.equals(user.getIsActive())) {
            return;
        }

        if (user.getEmailVerifiedAt() == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, EMAIL_NOT_VERIFIED);
        }

        throw new ResponseStatusException(HttpStatus.FORBIDDEN, ACCOUNT_DISABLED);
    }

    private AuthLoginResponseDto buildAuthResponse(User user) {
        boolean adminPortal = user.getRole().isAdminPortal();
        return AuthLoginResponseDto.builder()
                .accessToken(jwtService.generateAccessToken(user))
                .tokenType("Bearer")
                .expiresIn(jwtService.getExpirationMs())
                .refreshToken(jwtService.generateRefreshToken(user))
                .role(user.getRole())
                .portalType(adminPortal ? "ADMIN" : "CUSTOMER")
                .permissions(adminPortal ? permissionService.getPermissionCodesForUser(user) : List.of())
                .build();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
