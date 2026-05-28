package com.backend.service;

import java.security.SecureRandom;
import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.UUID;

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
import com.backend.entity.EmailVerification;
import com.backend.entity.User;
import com.backend.mail.VerificationEmailRenderer;
import com.backend.repository.EmailVerificationRepository;
import com.backend.repository.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailVerificationService.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private static final String INVALID_OTP = "Invalid or expired verification code";
    private static final String ALREADY_VERIFIED = "Email is already verified";
    private static final String RESEND_COOLDOWN = "Please wait before requesting a new verification code";

    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationProperties verificationProperties;
    private final MailProperties mailProperties;
    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Transactional
    public void sendVerificationForUser(User user) {
        assertNotVerified(user);

        emailVerificationRepository.deleteByUserIdAndVerifiedAtIsNull(user.getId());

        String otp = generateOtp();
        OffsetDateTime now = OffsetDateTime.now();

        emailVerificationRepository.save(EmailVerification.builder()
                .user(user)
                .otpHash(passwordEncoder.encode(otp))
                .expiresAt(now.plus(verificationProperties.getOtpExpiry()))
                .createdAt(now)
                .build());

        deliverOtp(user.getEmail(), otp);
    }

    @Transactional
    public User verifyEmail(String email, String otp) {
        User user = requireUnverifiedUser(email);
        EmailVerification verification = requireActiveVerification(user.getId());

        if (!passwordEncoder.matches(otp, verification.getOtpHash())) {
            verification.setAttemptCount(verification.getAttemptCount() + 1);
            emailVerificationRepository.save(verification);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_OTP);
        }

        OffsetDateTime now = OffsetDateTime.now();
        verification.setVerifiedAt(now);
        user.setEmailVerifiedAt(now);
        user.setIsActive(true);
        user.setUpdatedAt(now);

        emailVerificationRepository.save(verification);
        return userRepository.save(user);
    }

    @Transactional
    public void resendVerification(String email) {
        User user = requireUnverifiedUser(email);
        resendVerificationForUser(user);
    }

    /**
     * Gửi lại OTP cho user chưa xác thực (đăng nhập lại, resend thủ công, …).
     * Tuân thủ cooldown giữa các lần gửi.
     */
    @Transactional
    public void resendVerificationForUser(User user) {
        assertNotVerified(user);
        assertResendCooldown(user.getId());
        sendVerificationForUser(user);
    }

    private void assertResendCooldown(UUID userId) {
        emailVerificationRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .ifPresent(latest -> {
                    OffsetDateTime cooldownEndsAt = latest.getCreatedAt()
                            .plus(verificationProperties.getResendCooldown());
                    if (OffsetDateTime.now().isBefore(cooldownEndsAt)) {
                        throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, RESEND_COOLDOWN);
                    }
                });
    }

    private User requireUnverifiedUser(String email) {
        User user = userRepository.findByEmailIgnoreCase(email.trim().toLowerCase(Locale.ROOT))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        assertNotVerified(user);
        return user;
    }

    private EmailVerification requireActiveVerification(UUID userId) {
        EmailVerification verification = emailVerificationRepository
                .findFirstByUserIdAndVerifiedAtIsNullOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_OTP));

        OffsetDateTime now = OffsetDateTime.now();
        if (verification.getAttemptCount() >= verificationProperties.getMaxAttempts()
                || now.isAfter(verification.getExpiresAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_OTP);
        }

        return verification;
    }

    private void assertNotVerified(User user) {
        if (user.getEmailVerifiedAt() != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ALREADY_VERIFIED);
        }
    }

    private String generateOtp() {
        int length = verificationProperties.getOtpLength();
        StringBuilder otp = new StringBuilder(length);
        for (int index = 0; index < length; index++) {
            otp.append(RANDOM.nextInt(10));
        }
        return otp.toString();
    }

    private void deliverOtp(String email, String otp) {
        if (!mailProperties.isEnabled()) {
            log.warn("DEV OTP for {}: {} (expires in {})", email, otp, verificationProperties.getOtpExpiry());
            return;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            log.warn("Mail enabled but SMTP not configured — DEV OTP for {}: {}", email, otp);
            return;
        }

        long expiryMinutes = verificationProperties.getOtpExpiry().toMinutes();

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setFrom(mailProperties.getFrom());
            helper.setTo(email);
            helper.setSubject(VerificationEmailRenderer.subject());
            helper.setText(
                    VerificationEmailRenderer.plainText(otp, expiryMinutes),
                    VerificationEmailRenderer.html(otp, expiryMinutes));
            mailSender.send(mimeMessage);
        } catch (MailException | MessagingException mailException) {
            log.error("Failed to send verification email to {}", email, mailException);
            log.warn("DEV OTP for {}: {} (mail failed — fix Gmail App Password in application.properties)", email, otp);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Failed to send verification email. Please check SMTP configuration.");
        }
    }
}
