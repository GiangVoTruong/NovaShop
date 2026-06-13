package com.backend.common.exception;

import java.time.Instant;

import lombok.Builder;
import lombok.Value;

/**
 * Body JSON khi API lỗi — mọi handler trong {@link GlobalExceptionHandler} đều trả format này.
 * <p>
 * Ví dụ: {@code {"status":401,"message":"Invalid email or password","timestamp":"..."}}
 */
@Value
@Builder
public class ErrorResponse {

    /** Mã HTTP (400, 401, 404, 409, …). */
    int status;
    /** Thông báo cho client (tiếng Anh hoặc message nghiệp vụ). */
    String message;
    /** Thời điểm xảy ra lỗi (UTC). */
    Instant timestamp;

    /** Tạo bản ghi lỗi với {@code timestamp} = thời điểm hiện tại. */
    public static ErrorResponse of(int status, String message) {
        return ErrorResponse.builder()
                .status(status)
                .message(message)
                .timestamp(Instant.now())
                .build();
    }
}
