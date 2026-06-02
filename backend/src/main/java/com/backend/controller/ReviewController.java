package com.backend.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.reviews.CreateReviewRequestDto;
import com.backend.dto.reviews.GetReviewResponseDto;
import com.backend.service.ReviewService;
import com.backend.util.PaginationUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@Tag(name = "reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/api/products/{productId}/reviews")
    @Operation(summary = "Lấy review sản phẩm", description = "Danh sách review theo productId có phân trang.")
    public ResponseEntity<ApiResponse<java.util.List<GetReviewResponseDto>>> getProductReviews(
            @PathVariable UUID productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Page<GetReviewResponseDto> reviewPage = reviewService.getProductReviews(
                productId,
                PaginationUtils.toPageable(page, size, sortBy, sortDir));
        return ApiResponses.okPage(reviewPage, "Lấy review thành công");
    }

    @PostMapping("/api/products/{productId}/reviews")
    @Operation(summary = "Tạo review", description = "User đã mua và nhận hàng (DELIVERED) mới được review.")
    public ResponseEntity<ApiResponse<GetReviewResponseDto>> createReview(
            @PathVariable UUID productId,
            @Valid @RequestBody CreateReviewRequestDto request) {
        return ApiResponses.created(reviewService.createReview(productId, request), "Tạo review thành công");
    }

    @DeleteMapping("/api/reviews/{id}")
    @Operation(summary = "Xóa review", description = "Xóa review của chính user đang đăng nhập.")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable UUID id) {
        reviewService.deleteReview(id);
        return ApiResponses.okMessage("Xóa review thành công");
    }
}
