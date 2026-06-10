package com.backend.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.backend.config.StripeProperties;
import com.backend.config.VnpayProperties;
import com.backend.constants.NotificationI18nKeys;
import com.backend.dto.payments.CreateStripePaymentResponseDto;
import com.backend.dto.payments.CreateVnpayPaymentResponseDto;
import com.backend.dto.payments.VnpayIpnResponseDto;
import com.backend.entity.Payment;
import com.backend.entity.ShopOrder;
import com.backend.enums.NotificationType;
import com.backend.enums.OrderStatus;
import com.backend.enums.PaymentMethodType;
import com.backend.enums.PaymentStatusType;
import com.backend.enums.PaymentTxStatus;
import com.backend.repository.OrderRepository;
import com.backend.repository.PaymentRepository;
import com.backend.security.SecurityUtils;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private static final String ORDER_NOT_FOUND = "Order not found";
    private static final String FORBIDDEN_ORDER = "You can only pay for your own orders";
    private static final String INVALID_PAYMENT_METHOD = "Order is not configured for VNPay";
    private static final String ORDER_ALREADY_PAID = "Order is already paid";
    private static final String ORDER_NOT_PAYABLE = "Order is not payable";
    private static final String VNPAY_NOT_CONFIGURED = "VNPay is not configured";
    private static final String AMOUNT_MISMATCH = "Payment amount mismatch";
    private static final String SUCCESS_RESPONSE_CODE = "00";

    private static final String INVALID_STRIPE_PAYMENT_METHOD = "Order is not configured for Stripe";
    private static final String STRIPE_NOT_CONFIGURED = "Stripe is not configured";
    private static final String STRIPE_CREATE_FAILED = "Failed to create Stripe checkout session";
    private static final String STRIPE_WEBHOOK_INVALID = "Invalid Stripe webhook signature";

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final VnpayService vnpayService;
    private final StripeService stripeService;
    private final VnpayProperties vnpayProperties;
    private final StripeProperties stripeProperties;
    private final NotificationService notificationService;

    @Transactional
    public CreateVnpayPaymentResponseDto createVnpayPayment(UUID orderId, String clientIp) {
        assertVnpayConfigured();
        ShopOrder order = findPayableOrder(orderId, PaymentMethodType.VNPAY, INVALID_PAYMENT_METHOD);
        findOrCreatePendingPayment(order, PaymentMethodType.VNPAY);

        String orderInfo = "Thanh toan don hang " + order.getId();
        String paymentUrl = vnpayService.buildPaymentUrl(
                order.getId(),
                order.getFinalAmount(),
                clientIp,
                orderInfo);
        String txnRef = vnpayService.toTxnRef(order.getId());

        return CreateVnpayPaymentResponseDto.builder()
                .paymentUrl(paymentUrl)
                .txnRef(txnRef)
                .build();
    }

    @Transactional
    public CreateStripePaymentResponseDto createStripePayment(UUID orderId) {
        assertStripeConfigured();
        ShopOrder order = findPayableOrder(orderId, PaymentMethodType.STRIPE, INVALID_STRIPE_PAYMENT_METHOD);
        findOrCreatePendingPayment(order, PaymentMethodType.STRIPE);

        String orderInfo = "NovaShop order " + order.getId();
        try {
            Session session = stripeService.createCheckoutSession(order.getId(), order.getFinalAmount(), orderInfo);
            return CreateStripePaymentResponseDto.builder()
                    .checkoutUrl(session.getUrl())
                    .sessionId(session.getId())
                    .build();
        } catch (StripeException exception) {
            log.warn("Stripe checkout session creation failed for order {}", orderId);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, STRIPE_CREATE_FAILED);
        }
    }

    @Transactional
    public void handleStripeWebhook(String payload, String stripeSignature) {
        assertStripeWebhookConfigured();
        Event event;
        try {
            event = stripeService.constructWebhookEvent(payload, stripeSignature);
        } catch (SignatureVerificationException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, STRIPE_WEBHOOK_INVALID);
        }

        switch (event.getType()) {
            case "checkout.session.completed" -> handleStripeCheckoutCompleted(event);
            case "payment_intent.payment_failed" -> handleStripePaymentFailed(event);
            default -> log.debug("Ignoring Stripe event type {}", event.getType());
        }
    }

    private void handleStripeCheckoutCompleted(Event event) {
        Session session = deserializeStripeObject(event, Session.class);
        if (session == null || !"paid".equals(session.getPaymentStatus())) {
            return;
        }

        UUID orderId = parseOrderIdFromMetadata(session.getMetadata(), session.getId());
        if (orderId == null) {
            return;
        }

        ShopOrder order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return;
        }

        if (!isStripeAmountValid(session.getAmountTotal(), order.getFinalAmount())) {
            Payment payment = paymentRepository.findByOrder_Id(orderId)
                    .orElseGet(() -> createPendingPayment(order, PaymentMethodType.STRIPE));
            markPaymentFailed(payment, order);
            return;
        }

        Payment payment = paymentRepository.findByOrder_Id(orderId)
                .orElseGet(() -> createPendingPayment(order, PaymentMethodType.STRIPE));
        if (payment.getStatus() != PaymentTxStatus.SUCCESS) {
            markPaymentSuccess(order, payment);
        }
    }

    private void handleStripePaymentFailed(Event event) {
        PaymentIntent paymentIntent = deserializeStripeObject(event, PaymentIntent.class);
        if (paymentIntent == null) {
            return;
        }

        UUID orderId = parseOrderIdFromMetadata(paymentIntent.getMetadata(), paymentIntent.getId());
        if (orderId == null) {
            return;
        }

        ShopOrder order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return;
        }

        Payment payment = paymentRepository.findByOrder_Id(orderId)
                .orElseGet(() -> createPendingPayment(order, PaymentMethodType.STRIPE));
        if (payment.getStatus() != PaymentTxStatus.SUCCESS) {
            markPaymentFailed(payment, order);
        }
    }

    private <T extends StripeObject> T deserializeStripeObject(Event event, Class<T> type) {
        StripeObject stripeObject = event.getDataObjectDeserializer().getObject().orElse(null);
        if (stripeObject == null || !type.isInstance(stripeObject)) {
            log.warn("Unable to deserialize Stripe event {} as {}", event.getId(), type.getSimpleName());
            return null;
        }
        return type.cast(stripeObject);
    }

    private UUID parseOrderIdFromMetadata(Map<String, String> metadata, String stripeReference) {
        if (metadata == null || !StringUtils.hasText(metadata.get("orderId"))) {
            log.warn("Stripe object {} missing orderId metadata", stripeReference);
            return null;
        }
        try {
            return UUID.fromString(metadata.get("orderId"));
        } catch (IllegalArgumentException exception) {
            log.warn("Invalid orderId metadata on Stripe object {}", stripeReference);
            return null;
        }
    }

    private boolean isStripeAmountValid(Long amountTotal, BigDecimal orderAmount) {
        if (amountTotal == null) {
            return false;
        }
        long expectedAmount = orderAmount.setScale(0, java.math.RoundingMode.HALF_UP).longValueExact();
        return amountTotal == expectedAmount;
    }

    private ShopOrder findPayableOrder(UUID orderId, PaymentMethodType expectedMethod, String invalidMethodMessage) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        ShopOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, ORDER_NOT_FOUND));

        if (!order.getUser().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, FORBIDDEN_ORDER);
        }
        if (order.getPaymentMethod() != expectedMethod) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, invalidMethodMessage);
        }
        if (order.getPaymentStatus() == PaymentStatusType.PAID) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ORDER_ALREADY_PAID);
        }
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ORDER_NOT_PAYABLE);
        }
        return order;
    }

    private Payment findOrCreatePendingPayment(ShopOrder order, PaymentMethodType provider) {
        Payment payment = paymentRepository.findByOrder_Id(order.getId())
                .orElseGet(() -> createPendingPayment(order, provider));
        if (payment.getStatus() == PaymentTxStatus.SUCCESS) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ORDER_ALREADY_PAID);
        }
        return payment;
    }

    @Transactional
    public VnpayIpnResponseDto handleIpn(Map<String, String> params) {
        if (!vnpayService.isValidSignature(params)) {
            return ipnResponse("97", "Invalid signature");
        }

        return processVnpayCallback(params, true);
    }

    @Transactional
    public String handleReturn(Map<String, String> params) {
        if (!vnpayService.isValidSignature(params)) {
            return buildFrontendRedirect(null, "failed", "invalid_signature");
        }

        VnpayIpnResponseDto result = processVnpayCallback(params, false);
        UUID orderId = null;
        try {
            orderId = resolveOrderId(params);
        } catch (IllegalArgumentException exception) {
            orderId = null;
        }
        String paymentResult = SUCCESS_RESPONSE_CODE.equals(result.getRspCode()) ? "success" : "failed";
        return buildFrontendRedirect(orderId, paymentResult, params.get("vnp_ResponseCode"));
    }

    private VnpayIpnResponseDto processVnpayCallback(Map<String, String> params, boolean ipnFlow) {
        UUID orderId;
        try {
            orderId = resolveOrderId(params);
        } catch (IllegalArgumentException exception) {
            return ipnResponse("01", "Order not found");
        }

        ShopOrder order = orderRepository.findById(orderId)
                .orElse(null);
        if (order == null) {
            return ipnResponse("01", "Order not found");
        }

        Payment payment = paymentRepository.findByOrder_Id(orderId)
                .orElseGet(() -> createPendingPayment(order, PaymentMethodType.VNPAY));

        BigDecimal callbackAmount = vnpayService.parseVnpayAmount(params.get("vnp_Amount"));
        if (order.getFinalAmount().compareTo(callbackAmount) != 0) {
            markPaymentFailed(payment, order);
            return ipnResponse("04", AMOUNT_MISMATCH);
        }

        String responseCode = params.get("vnp_ResponseCode");
        String transactionStatus = params.get("vnp_TransactionStatus");

        if (SUCCESS_RESPONSE_CODE.equals(responseCode) && "00".equals(transactionStatus)) {
            if (payment.getStatus() != PaymentTxStatus.SUCCESS) {
                markPaymentSuccess(order, payment);
            }
            return ipnResponse("00", ipnFlow ? "Confirm Success" : "Success");
        }

        if (payment.getStatus() != PaymentTxStatus.SUCCESS) {
            markPaymentFailed(payment, order);
        }
        return ipnResponse("02", "Payment failed");
    }

    private UUID resolveOrderId(Map<String, String> params) {
        return vnpayService.parseOrderIdFromTxnRef(params.get("vnp_TxnRef"));
    }

    private Payment createPendingPayment(ShopOrder order, PaymentMethodType provider) {
        OffsetDateTime now = OffsetDateTime.now();
        Payment payment = Payment.builder()
                .order(order)
                .provider(provider)
                .amount(order.getFinalAmount())
                .status(PaymentTxStatus.PENDING)
                .createdAt(now)
                .updatedAt(now)
                .build();
        return paymentRepository.save(payment);
    }

    private void markPaymentSuccess(ShopOrder order, Payment payment) {
        OffsetDateTime now = OffsetDateTime.now();
        payment.setStatus(PaymentTxStatus.SUCCESS);
        payment.setUpdatedAt(now);
        paymentRepository.save(payment);

        order.setPaymentStatus(PaymentStatusType.PAID);
        order.setUpdatedAt(now);
        orderRepository.save(order);

        notificationService.createI18n(
                order.getUser(),
                NotificationType.ORDER_STATUS,
                NotificationI18nKeys.ORDER_STATUS_UPDATED,
                Map.of(
                        "orderId", order.getId().toString(),
                        "status", "PAID"));
    }

    private void markPaymentFailed(Payment payment, ShopOrder order) {
        payment.setStatus(PaymentTxStatus.FAILED);
        payment.setUpdatedAt(OffsetDateTime.now());
        paymentRepository.save(payment);

        notificationService.createI18n(
                order.getUser(),
                NotificationType.ORDER_STATUS,
                NotificationI18nKeys.PAYMENT_FAILED,
                Map.of("orderId", order.getId().toString()));
    }

    private void assertVnpayConfigured() {
        if (!StringUtils.hasText(vnpayProperties.getTmnCode())
                || !StringUtils.hasText(vnpayProperties.getHashSecret())) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, VNPAY_NOT_CONFIGURED);
        }
    }

    private void assertStripeConfigured() {
        if (!StringUtils.hasText(stripeProperties.getSecretKey())) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, STRIPE_NOT_CONFIGURED);
        }
    }

    private void assertStripeWebhookConfigured() {
        if (!StringUtils.hasText(stripeProperties.getWebhookSecret())) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, STRIPE_NOT_CONFIGURED);
        }
    }

    private VnpayIpnResponseDto ipnResponse(String rspCode, String message) {
        return VnpayIpnResponseDto.builder()
                .rspCode(rspCode)
                .message(message)
                .build();
    }

    private String buildFrontendRedirect(UUID orderId, String paymentResult, String responseCode) {
        String baseUrl = trimTrailingSlash(vnpayProperties.getFrontendRedirectUrl());
        StringBuilder redirectUrl = new StringBuilder(baseUrl);
        redirectUrl.append("/orders?vnpay=").append(paymentResult);
        if (orderId != null) {
            redirectUrl.append("&orderId=").append(orderId);
        }
        if (StringUtils.hasText(responseCode)) {
            redirectUrl.append("&vnp_ResponseCode=").append(responseCode);
        }
        return redirectUrl.toString();
    }

    private String trimTrailingSlash(String value) {
        if (!StringUtils.hasText(value)) {
            return "";
        }
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }
}
