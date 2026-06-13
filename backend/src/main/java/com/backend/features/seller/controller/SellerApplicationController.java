package com.backend.features.seller.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.seller.dto.CreateSellerApplicationRequestDto;
import com.backend.features.seller.dto.GetSellerApplicationResponseDto;
import com.backend.features.seller.dto.ReviewSellerApplicationRequestDto;
import com.backend.features.seller.service.SellerApplicationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seller-applications")
@RequiredArgsConstructor
@Tag(name = "seller-applications")
public class SellerApplicationController {

    private final SellerApplicationService sellerApplicationService;

    @PostMapping
    @Operation(
            summary = "Gửi đơn đăng ký seller",
            description = "Tạo mới đơn đăng ký trở thành seller cho người dùng hiện tại.")
    public ResponseEntity<ApiResponse<GetSellerApplicationResponseDto>> apply(
            @Valid @RequestBody CreateSellerApplicationRequestDto request) {
        return ApiResponses.created(sellerApplicationService.apply(request), "Gửi đơn đăng ký seller thành công");
    }

    @GetMapping("/mine")
    @Operation(
            summary = "Lấy đơn đăng ký seller của tôi",
            description = "Trả về đơn đăng ký seller hiện tại của người dùng đang đăng nhập.")
    public ResponseEntity<ApiResponse<GetSellerApplicationResponseDto>> getMyApplication() {
        return ApiResponses.ok(sellerApplicationService.getMyApplication(), "Lấy đơn đăng ký thành công");
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách đơn đăng ký seller",
            description = "Trả về danh sách đơn đăng ký seller, có thể lọc theo trạng thái.")
    public ResponseEntity<ApiResponse<List<GetSellerApplicationResponseDto>>> listApplications(
            @RequestParam(required = false) String status) {
        return ApiResponses.ok(sellerApplicationService.listApplications(status), "Lấy danh sách đơn đăng ký thành công");
    }

    @PutMapping("/{id}/review")
    @Operation(
            summary = "Duyệt hoặc từ chối đơn seller",
            description = "Admin/Seller manager cập nhật kết quả review cho đơn đăng ký seller theo ID.")
    public ResponseEntity<ApiResponse<GetSellerApplicationResponseDto>> reviewApplication(
            @PathVariable UUID id,
            @Valid @RequestBody ReviewSellerApplicationRequestDto request) {
        return ApiResponses.ok(sellerApplicationService.reviewApplication(id, request), "Duyệt đơn đăng ký thành công");
    }
}

