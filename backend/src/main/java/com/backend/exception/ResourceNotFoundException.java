package com.backend.exception;

/**
 * Ném khi không tìm thấy tài nguyên theo id hoặc điều kiện (ví dụ user không tồn tại).
 * {@link GlobalExceptionHandler} bắt và trả HTTP 404.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
