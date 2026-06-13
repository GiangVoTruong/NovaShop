package com.backend.features.payment.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.backend.config.VnpayProperties;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VnpayService {

    private static final String VERSION = "2.1.0";
    private static final String COMMAND = "pay";
    private static final String CURR_CODE = "VND";
    private static final String LOCALE = "vn";
    private static final String ORDER_TYPE = "billpayment";
    private static final DateTimeFormatter VNPAY_DATE_FORMAT =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final VnpayProperties vnpayProperties;

    public String buildPaymentUrl(UUID orderId, BigDecimal amount, String clientIp, String orderInfo) {
        String txnRef = toTxnRef(orderId);
        LocalDateTime now = LocalDateTime.now(VIETNAM_ZONE);
        LocalDateTime expireAt = now.plusMinutes(vnpayProperties.getExpireMinutes());

        Map<String, String> params = new HashMap<>();
        params.put("vnp_Version", VERSION);
        params.put("vnp_Command", COMMAND);
        params.put("vnp_TmnCode", vnpayProperties.getTmnCode());
        params.put("vnp_Amount", toVnpayAmount(amount));
        params.put("vnp_CurrCode", CURR_CODE);
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", orderInfo);
        params.put("vnp_OrderType", ORDER_TYPE);
        params.put("vnp_Locale", LOCALE);
        params.put("vnp_ReturnUrl", vnpayProperties.getReturnUrl());
        params.put("vnp_IpAddr", clientIp);
        params.put("vnp_CreateDate", now.format(VNPAY_DATE_FORMAT));
        params.put("vnp_ExpireDate", expireAt.format(VNPAY_DATE_FORMAT));

        String secureHash = signParams(params);
        String query = buildQueryString(params);
        return vnpayProperties.getPayUrl() + "?" + query + "&vnp_SecureHash=" + secureHash;
    }

    public boolean isValidSignature(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        if (!StringUtils.hasText(receivedHash)) {
            return false;
        }

        Map<String, String> signParams = new HashMap<>(params);
        signParams.remove("vnp_SecureHash");
        signParams.remove("vnp_SecureHashType");

        String calculatedHash = signParams(signParams);
        return receivedHash.equalsIgnoreCase(calculatedHash);
    }

    public UUID parseOrderIdFromTxnRef(String txnRef) {
        if (!StringUtils.hasText(txnRef)) {
            throw new IllegalArgumentException("Missing transaction reference");
        }
        String normalized = txnRef.trim();
        if (normalized.length() != 32) {
            throw new IllegalArgumentException("Invalid transaction reference");
        }
        String uuidValue = normalized.substring(0, 8) + "-"
                + normalized.substring(8, 12) + "-"
                + normalized.substring(12, 16) + "-"
                + normalized.substring(16, 20) + "-"
                + normalized.substring(20);
        return UUID.fromString(uuidValue);
    }

    public BigDecimal parseVnpayAmount(String vnpAmount) {
        long amountInSmallestUnit = Long.parseLong(vnpAmount);
        return BigDecimal.valueOf(amountInSmallestUnit)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    public String toTxnRef(UUID orderId) {
        return orderId.toString().replace("-", "");
    }

    private String toVnpayAmount(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .toPlainString();
    }

    private String signParams(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);
            if (fieldValue == null || fieldValue.isEmpty()) {
                continue;
            }
            hashData.append(fieldName);
            hashData.append('=');
            hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
            hashData.append('&');
        }
        if (!hashData.isEmpty()) {
            hashData.setLength(hashData.length() - 1);
        }
        return hmacSha512(vnpayProperties.getHashSecret(), hashData.toString());
    }

    private String buildQueryString(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = params.get(fieldName);
            if (fieldValue == null || fieldValue.isEmpty()) {
                continue;
            }
            query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8));
            query.append('=');
            query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
            query.append('&');
        }
        if (!query.isEmpty()) {
            query.setLength(query.length() - 1);
        }
        return query.toString();
    }

    private String hmacSha512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(secretKey);
            byte[] hashBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder(hashBytes.length * 2);
            for (byte hashByte : hashBytes) {
                builder.append(String.format("%02x", hashByte & 0xff));
            }
            return builder.toString();
        } catch (Exception exception) {
            throw new IllegalStateException("Failed to sign VNPay payload", exception);
        }
    }
}
