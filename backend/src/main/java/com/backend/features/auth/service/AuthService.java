package com.backend.features.auth.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.features.auth.dto.AuthGoogleRequestDto;
import com.backend.features.auth.dto.AuthLoginRequestDto;
import com.backend.features.auth.dto.ChangePasswordRequestDto;
import com.backend.features.auth.dto.AuthLoginResponseDto;
import com.backend.features.auth.dto.AuthRefreshRequestDto;
import com.backend.features.auth.dto.AuthRegisterRequestDto;
import com.backend.features.auth.dto.AuthRegisterResponseDto;
import com.backend.features.auth.dto.AuthResendVerificationRequestDto;
import com.backend.features.auth.dto.AuthVerifyEmailRequestDto;
import com.backend.features.user.User;
import com.backend.common.enums.UserRole;
import com.backend.features.user.repository.UserRepository;
import com.backend.features.auth.security.JwtService;
import com.backend.features.auth.security.SecurityUtils;

import lombok.RequiredArgsConstructor;
import com.backend.features.permission.service.PermissionService;
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String INVALID_CREDENTIALS = "Invalid email or password";
    private static final String REGISTER_SUCCESS = "Registration successful. Please verify your email with the OTP sent to your inbox.";
    private static final String EMAIL_ALREADY_REGISTERED = "Email already registered";
    private static final String EMAIL_NOT_VERIFIED
            = "Email not verified. A new verification code has been sent to your inbox.";
    private static final String INVALID_GOOGLE_ACCOUNT = "Google account cannot be linked to this email";
    private static final String ACCOUNT_DISABLED = "Account is disabled";
    private static final String INVALID_REFRESH_TOKEN = "Invalid refresh token";
    private static final String CURRENT_PASSWORD_INCORRECT = "Current password is incorrect";
    private static final String PASSWORDS_DO_NOT_MATCH = "New password and confirm password do not match";
    private static final String PASSWORD_UNCHANGED = "New password must be different from current password";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailVerificationService emailVerificationService;
    private final PermissionService permissionService;
    private final GoogleTokenVerifierService googleTokenVerifierService;

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

    @Transactional
    public AuthLoginResponseDto login(AuthLoginRequestDto request) {
        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.getEmail()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_CREDENTIALS));

        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_CREDENTIALS);
        }

        if (user.getEmailVerifiedAt() == null) {
            emailVerificationService.resendVerificationForUser(user);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, EMAIL_NOT_VERIFIED);
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, ACCOUNT_DISABLED);
        }

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthLoginResponseDto loginWithGoogle(AuthGoogleRequestDto request) {
        GoogleTokenVerifierService.VerifiedGoogleProfile profile =
                googleTokenVerifierService.verify(request.getIdToken());

        User user = userRepository.findByGoogleId(profile.googleId())
                .orElseGet(() -> resolveGoogleUser(profile));

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, ACCOUNT_DISABLED);
        }

        return buildAuthResponse(user);
    }

    @Transactional
    public void changePassword(ChangePasswordRequestDto request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, PASSWORDS_DO_NOT_MATCH);
        }
        if (request.getNewPassword().equals(request.getCurrentPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, PASSWORD_UNCHANGED);
        }

        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));

        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, CURRENT_PASSWORD_INCORRECT);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(OffsetDateTime.now());
        userRepository.save(user);
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

    private User resolveGoogleUser(GoogleTokenVerifierService.VerifiedGoogleProfile profile) {
        String email = normalizeEmail(profile.email());
        OffsetDateTime now = OffsetDateTime.now();

        return userRepository.findByEmailIgnoreCase(email)
                .map(existingUser -> linkGoogleAccount(existingUser, profile, now))
                .orElseGet(() -> userRepository.save(User.builder()
                        .email(email)
                        .googleId(profile.googleId())
                        .fullName(profile.fullName())
                        .avatarUrl(profile.avatarUrl())
                        .role(UserRole.CUSTOMER)
                        .isActive(true)
                        .emailVerifiedAt(profile.emailVerified() ? now : null)
                        .createdAt(now)
                        .updatedAt(now)
                        .build()));
    }

    private User linkGoogleAccount(
            User existingUser,
            GoogleTokenVerifierService.VerifiedGoogleProfile profile,
            OffsetDateTime now) {
        if (existingUser.getGoogleId() != null
                && !existingUser.getGoogleId().equals(profile.googleId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, INVALID_GOOGLE_ACCOUNT);
        }

        existingUser.setGoogleId(profile.googleId());
        if (existingUser.getFullName() == null || existingUser.getFullName().isBlank()) {
            existingUser.setFullName(profile.fullName());
        }
        if (existingUser.getAvatarUrl() == null && profile.avatarUrl() != null) {
            existingUser.setAvatarUrl(profile.avatarUrl());
        }
        if (existingUser.getEmailVerifiedAt() == null && profile.emailVerified()) {
            existingUser.setEmailVerifiedAt(now);
            existingUser.setIsActive(true);
        }
        existingUser.setUpdatedAt(now);
        return userRepository.save(existingUser);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
