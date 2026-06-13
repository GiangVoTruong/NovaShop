package com.backend.features.auth.service;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.config.MailProperties;
import com.backend.config.VerificationProperties;
import com.backend.features.auth.dto.AuthForgotPasswordRequestDto;
import com.backend.features.auth.dto.AuthResetPasswordRequestDto;
import com.backend.features.auth.EmailVerification;
import com.backend.features.user.User;
import com.backend.features.auth.repository.EmailVerificationRepository;
import com.backend.features.user.repository.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String FORGOT_PASSWORD_MESSAGE = "If the email exists, a reset code was sent";
    private static final String INVALID_OTP = "Invalid or expired reset code";
    private static final String TOO_MANY_REQUESTS = "Too many reset requests. Please try again later";
    private static final int MAX_RESET_REQUESTS_PER_HOUR = 5;

    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationProperties verificationProperties;
    private final MailProperties mailProperties;
    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    public String getForgotPasswordMessage() {
        return FORGOT_PASSWORD_MESSAGE;
    }

    @Transactional
    public void forgotPassword(AuthForgotPasswordRequestDto request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        userRepository.findByEmailIgnoreCase(normalizedEmail).ifPresent(this::sendResetOtpIfAllowed);
    }

    @Transactional
    public void resetPassword(AuthResetPasswordRequestDto request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_OTP));

        EmailVerification verification = emailVerificationRepository
                .findFirstByUserIdAndVerifiedAtIsNullOrderByCreatedAtDesc(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_OTP));

        OffsetDateTime now = OffsetDateTime.now();
        if (verification.getAttemptCount() >= verificationProperties.getMaxAttempts()
                || now.isAfter(verification.getExpiresAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_OTP);
        }

        if (!passwordEncoder.matches(request.getOtp(), verification.getOtpHash())) {
            verification.setAttemptCount(verification.getAttemptCount() + 1);
            emailVerificationRepository.save(verification);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_OTP);
        }

        verification.setVerifiedAt(now);
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(now);
        emailVerificationRepository.save(verification);
        userRepository.save(user);
    }

    private void sendResetOtpIfAllowed(User user) {
        OffsetDateTime oneHourAgo = OffsetDateTime.now().minusHours(1);
        long recentRequests = emailVerificationRepository.countByUserIdAndCreatedAtAfter(user.getId(), oneHourAgo);
        if (recentRequests >= MAX_RESET_REQUESTS_PER_HOUR) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, TOO_MANY_REQUESTS);
        }

        emailVerificationRepository.deleteByUserIdAndVerifiedAtIsNull(user.getId());

        String otp = generateOtp();
        OffsetDateTime now = OffsetDateTime.now();
        emailVerificationRepository.save(EmailVerification.builder()
                .user(user)
                .otpHash(passwordEncoder.encode(otp))
                .expiresAt(now.plusMinutes(10))
                .createdAt(now)
                .build());

        deliverResetOtp(user.getEmail(), otp);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String generateOtp() {
        int length = verificationProperties.getOtpLength();
        StringBuilder otp = new StringBuilder(length);
        for (int index = 0; index < length; index++) {
            otp.append(RANDOM.nextInt(10));
        }
        return otp.toString();
    }

    private void deliverResetOtp(String email, String otp) {
        if (!mailProperties.isEnabled()) {
            log.warn("DEV password reset OTP for {}: {} (expires in 10 minutes)", email, otp);
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            log.warn("Mail enabled but SMTP not configured — DEV password reset OTP for {}: {}", email, otp);
            return;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            helper.setFrom(mailProperties.getFrom());
            helper.setTo(email);
            helper.setSubject("NovaShop — Password reset code");
            helper.setText("Your password reset code is: " + otp + "\n\nThis code expires in 10 minutes.");
            mailSender.send(mimeMessage);
        } catch (MailException | MessagingException mailException) {
            log.error("Failed to send password reset email to {}", email, mailException);
            log.warn("DEV password reset OTP for {}: {}", email, otp);
        }
    }
}
