package com.backend.features.payment.controller;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.payment.dto.CreateVnpayPaymentRequestDto;
import com.backend.features.payment.dto.CreateVnpayPaymentResponseDto;
import com.backend.features.payment.dto.VnpayIpnResponseDto;
import com.backend.features.payment.service.PaymentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.backend.features.payment.Payment;
@RestController
@RequestMapping("/api/payments/vnpay")
@RequiredArgsConstructor
@Tag(name = "payments")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    @Operation(
            summary = "Tạo URL thanh toán VNPay",
            description = "Tạo liên kết chuyển hướng sang cổng VNPay cho đơn hàng VNPAY chưa thanh toán.")
    public ResponseEntity<ApiResponse<CreateVnpayPaymentResponseDto>> createVnpayPayment(
            @Valid @RequestBody CreateVnpayPaymentRequestDto request,
            HttpServletRequest servletRequest) {
        String clientIp = resolveClientIp(servletRequest);
        CreateVnpayPaymentResponseDto response = paymentService.createVnpayPayment(request.getOrderId(), clientIp);
        return ApiResponses.ok(response, "VNPay payment URL created");
    }

    @GetMapping("/ipn")
    @Operation(
            summary = "VNPay IPN callback",
            description = "Endpoint server-to-server VNPay gọi để xác nhận giao dịch.")
    public ResponseEntity<VnpayIpnResponseDto> handleIpn(@RequestParam Map<String, String> params) {
        VnpayIpnResponseDto response = paymentService.handleIpn(params);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/return")
    @Operation(
            summary = "VNPay return URL",
            description = "VNPay redirect trình duyệt về đây sau khi khách thanh toán.")
    public ResponseEntity<Void> handleReturn(@RequestParam Map<String, String> params) {
        String redirectUrl = paymentService.handleReturn(params);
        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, redirectUrl)
                .build();
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) {
            return realIp.trim();
        }
        return request.getRemoteAddr();
    }
}
