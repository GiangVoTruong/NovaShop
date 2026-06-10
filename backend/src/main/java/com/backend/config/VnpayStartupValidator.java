package com.backend.config;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class VnpayStartupValidator {

    private final VnpayProperties vnpayProperties;

    @EventListener(ApplicationReadyEvent.class)
    void logVnpayConfigurationStatus() {
        if (StringUtils.hasText(vnpayProperties.getTmnCode())
                && StringUtils.hasText(vnpayProperties.getHashSecret())) {
            log.info("VNPay configured (sandbox TMN: {})", mask(vnpayProperties.getTmnCode()));
            return;
        }
        log.warn("VNPay is NOT configured — set VNPAY_TMN_CODE and VNPAY_HASH_SECRET in backend/.env "
                + "or app.vnpay.* in application-local.properties");
    }

    private String mask(String value) {
        if (value.length() <= 4) {
            return "****";
        }
        return value.substring(0, 2) + "****" + value.substring(value.length() - 2);
    }
}
