package com.backend.dto.common;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public final class ApiResponses {

    private ApiResponses() {
    }

    public static <T> ResponseEntity<ApiResponse<T>> ok(T data, String message) {
        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK.value(), message, data, null));
    }

    public static <T> ResponseEntity<ApiResponse<List<T>>> okPage(Page<T> page, String message) {
        PageMeta meta = PageMeta.builder()
                .page(page.getNumber() + 1)
                .limit(page.getSize())
                .total(page.getTotalElements())
                .build();
        return ResponseEntity.ok(ApiResponse.success(
                HttpStatus.OK.value(), message, page.getContent(), meta));
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(T data, String message) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(HttpStatus.CREATED.value(), message, data, null));
    }

    public static ResponseEntity<ApiResponse<Void>> okMessage(String message) {
        return ResponseEntity.ok(ApiResponse.success(HttpStatus.OK.value(), message, null, null));
    }
}
