package com.backend.controller;

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

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.sellers.CreateSellerApplicationRequestDto;
import com.backend.dto.sellers.GetSellerApplicationResponseDto;
import com.backend.dto.sellers.ReviewSellerApplicationRequestDto;
import com.backend.service.SellerApplicationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seller-applications")
@RequiredArgsConstructor
public class SellerApplicationController {

    private final SellerApplicationService sellerApplicationService;

    @PostMapping
    public ResponseEntity<ApiResponse<GetSellerApplicationResponseDto>> apply(
            @Valid @RequestBody CreateSellerApplicationRequestDto request) {
        return ApiResponses.created(sellerApplicationService.apply(request), "Gửi đơn đăng ký seller thành công");
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<GetSellerApplicationResponseDto>> getMyApplication() {
        return ApiResponses.ok(sellerApplicationService.getMyApplication(), "Lấy đơn đăng ký thành công");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GetSellerApplicationResponseDto>>> listApplications(
            @RequestParam(required = false) String status) {
        return ApiResponses.ok(sellerApplicationService.listApplications(status), "Lấy danh sách đơn đăng ký thành công");
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<ApiResponse<GetSellerApplicationResponseDto>> reviewApplication(
            @PathVariable UUID id,
            @Valid @RequestBody ReviewSellerApplicationRequestDto request) {
        return ApiResponses.ok(sellerApplicationService.reviewApplication(id, request), "Duyệt đơn đăng ký thành công");
    }
}
