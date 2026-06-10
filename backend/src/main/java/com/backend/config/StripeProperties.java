package com.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.stripe")
public class StripeProperties {

    private String secretKey = "";
    private String webhookSecret = "";
    private String frontendRedirectUrl = "http://localhost:5173";
    private String currency = "vnd";
}
