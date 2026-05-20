package com.backend.exception;

import java.time.Instant;

import lombok.Builder;
import lombok.Value;

/**
 * Dạng JSON thống nhất cho lỗi API: mã HTTP, thông báo, thời điểm (để client log / hiển thị).
 */
@Value
@Builder
public class ErrorResponse {

    int status;
    String message;
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
