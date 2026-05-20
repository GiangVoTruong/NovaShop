package com.backend.exception;

/**
 * Ném khi thao tác vi phạm ràng buộc nghiệp vụ kiểu "đã tồn tại" / trùng dữ liệu
 * (ví dụ email đăng ký đã có). {@link GlobalExceptionHandler} bắt exception này và trả HTTP 409.
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
