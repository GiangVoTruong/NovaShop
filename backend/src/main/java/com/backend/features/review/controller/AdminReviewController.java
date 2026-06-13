package com.backend.features.review.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.review.dto.CreateReviewReplyRequestDto;
import com.backend.features.review.dto.GetReviewResponseDto;
import com.backend.features.review.service.ReviewService;
import com.backend.common.util.PaginationUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.backend.features.review.Review;
@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
@Tag(name = "admin-reviews")
public class AdminReviewController {

    private final ReviewService reviewService;

    @GetMapping
    @Operation(summary = "Danh sách review (admin)", description = "Lọc theo productId, phân trang — role ADMIN.")
    public ResponseEntity<ApiResponse<List<GetReviewResponseDto>>> listReviews(
            @RequestParam(required = false) UUID productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponses.okPage(
                reviewService.getAllReviewsAdmin(productId, PaginationUtils.toPageable(page, size, "createdAt", "desc")),
                "Reviews loaded");
    }

    @PatchMapping("/{id}/hide")
    @Operation(summary = "Ẩn review (admin)", description = "Đặt trạng thái review thành HIDDEN.")
    public ResponseEntity<ApiResponse<GetReviewResponseDto>> hideReview(@PathVariable UUID id) {
        return ApiResponses.ok(reviewService.hideReviewAdmin(id), "Review hidden");
    }

    @PostMapping("/{id}/reply")
    @Operation(summary = "Trả lời review (admin)", description = "Admin phản hồi đánh giá của khách hàng.")
    public ResponseEntity<ApiResponse<GetReviewResponseDto>> replyToReview(
            @PathVariable UUID id,
            @Valid @RequestBody CreateReviewReplyRequestDto request) {
        return ApiResponses.ok(reviewService.replyToReviewAdmin(id, request), "Reply posted");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa review (admin)", description = "Admin xóa review theo ID.")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable UUID id) {
        reviewService.deleteReviewAdmin(id);
        return ApiResponses.okMessage("Review deleted");
    }
}
