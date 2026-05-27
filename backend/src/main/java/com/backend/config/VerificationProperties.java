package com.backend.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.verification")
public class VerificationProperties {

    private int otpLength = 6;
    private Duration otpExpiry = Duration.ofMinutes(5);
    private int maxAttempts = 5;
    private Duration resendCooldown = Duration.ofSeconds(60);
}
