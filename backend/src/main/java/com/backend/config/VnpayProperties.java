package com.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.vnpay")
public class VnpayProperties {

    private String tmnCode = "";
    private String hashSecret = "";
    private String payUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private String returnUrl = "http://localhost:8080/api/payments/vnpay/return";
    private String ipnUrl = "http://localhost:8080/api/payments/vnpay/ipn";
    private String frontendRedirectUrl = "http://localhost:5173";
    private int expireMinutes = 15;
}
