package com.backend.features.payment.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.backend.config.StripeProperties;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StripeService {

    private final StripeProperties stripeProperties;

    public Session createCheckoutSession(UUID orderId, BigDecimal amount, String orderInfo) throws StripeException {
        Stripe.apiKey = stripeProperties.getSecretKey();

        long unitAmount = amount.setScale(0, RoundingMode.HALF_UP).longValueExact();
        String frontendBase = trimTrailingSlash(stripeProperties.getFrontendRedirectUrl());
        String successUrl = frontendBase + "/orders?stripe=success&orderId=" + orderId;
        String cancelUrl = frontendBase + "/orders?stripe=failed&orderId=" + orderId;

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .putMetadata("orderId", orderId.toString())
                .setPaymentIntentData(SessionCreateParams.PaymentIntentData.builder()
                        .putMetadata("orderId", orderId.toString())
                        .build())
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency(stripeProperties.getCurrency())
                                .setUnitAmount(unitAmount)
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(orderInfo)
                                        .build())
                                .build())
                        .build())
                .build();

        return Session.create(params);
    }

    public Event constructWebhookEvent(String payload, String signatureHeader)
            throws SignatureVerificationException {
        return Webhook.constructEvent(payload, signatureHeader, stripeProperties.getWebhookSecret());
    }

    private String trimTrailingSlash(String value) {
        if (!StringUtils.hasText(value)) {
            return "";
        }
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }
}
