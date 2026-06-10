package com.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.reviews.GetReviewResponseDto;
import com.backend.service.ReviewService;
import com.backend.util.PaginationUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

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

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa review (admin)", description = "Admin xóa review theo ID.")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable UUID id) {
        reviewService.deleteReviewAdmin(id);
        return ApiResponses.okMessage("Review deleted");
    }
}
