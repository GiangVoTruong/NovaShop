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
public class StripeStartupValidator {

    private final StripeProperties stripeProperties;

    @EventListener(ApplicationReadyEvent.class)
    void logStripeConfigurationStatus() {
        if (StringUtils.hasText(stripeProperties.getSecretKey())) {
            log.info("Stripe configured (currency: {})", stripeProperties.getCurrency());
            return;
        }
        log.warn("Stripe is NOT configured — set STRIPE_SECRET_KEY in backend/.env "
                + "or app.stripe.* in application-local.properties");
    }
}
