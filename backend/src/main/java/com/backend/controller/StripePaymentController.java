package com.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.payments.CreateStripePaymentRequestDto;
import com.backend.dto.payments.CreateStripePaymentResponseDto;
import com.backend.service.PaymentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments/stripe")
@RequiredArgsConstructor
@Tag(name = "payments")
public class StripePaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    @Operation(
            summary = "Tạo Stripe Checkout Session",
            description = "Tạo phiên thanh toán Stripe cho đơn STRIPE chưa thanh toán.")
    public ResponseEntity<ApiResponse<CreateStripePaymentResponseDto>> createStripePayment(
            @Valid @RequestBody CreateStripePaymentRequestDto request) {
        CreateStripePaymentResponseDto response = paymentService.createStripePayment(request.getOrderId());
        return ApiResponses.ok(response, "Stripe checkout session created");
    }

    @PostMapping("/webhook")
    @Operation(
            summary = "Stripe webhook",
            description = "Stripe gọi server-to-server để xác nhận thanh toán.")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String stripeSignature) {
        paymentService.handleStripeWebhook(payload, stripeSignature);
        return ResponseEntity.status(HttpStatus.OK).body("ok");
    }
}
