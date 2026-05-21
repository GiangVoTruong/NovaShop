package com.backend.exception;

import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

/**
 * Bắt lỗi từ mọi controller và trả JSON {@link ErrorResponse} thống nhất.
 * <p>
 * Service ném lỗi bằng {@link org.springframework.web.server.ResponseStatusException}:
 * <pre>
 *   throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
 *   throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
 *   throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
 * </pre>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** Lỗi nghiệp vụ có HTTP status (404, 409, 401, 403, …). */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatus(ResponseStatusException ex) {
        int status = ex.getStatusCode().value();
        String message = ex.getReason() != null ? ex.getReason() : ex.getStatusCode().toString();
        return ResponseEntity.status(ex.getStatusCode()).body(ErrorResponse.of(status, message));
    }

    /** Lỗi validation {@code @Valid} trên DTO — HTTP 400, gộp message theo field. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return ResponseEntity.badRequest().body(ErrorResponse.of(400, message));
    }
}
