package com.backend.features.coupon.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.coupon.dto.CreateCouponRequestDto;
import com.backend.features.coupon.dto.GetCouponResponseDto;
import com.backend.features.coupon.dto.UpdateCouponRequestDto;
import com.backend.features.coupon.service.CouponService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/coupons")
@RequiredArgsConstructor
@Tag(name = "admin-coupons")
public class AdminCouponController {

    private final CouponService couponService;

    @GetMapping
    @Operation(summary = "Danh sách coupon", description = "Lấy danh sách coupon — role ADMIN.")
    public ResponseEntity<ApiResponse<List<GetCouponResponseDto>>> getAllCoupons() {
        return ApiResponses.ok(couponService.getAllCouponsAdmin(), "Lấy danh sách coupon thành công");
    }

    @PostMapping
    @Operation(summary = "Tạo coupon", description = "Tạo coupon mới — role ADMIN.")
    public ResponseEntity<ApiResponse<GetCouponResponseDto>> createCoupon(
            @Valid @RequestBody CreateCouponRequestDto request) {
        return ApiResponses.created(couponService.createCoupon(request), "Tạo coupon thành công");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật coupon", description = "Cập nhật coupon theo ID — role ADMIN.")
    public ResponseEntity<ApiResponse<GetCouponResponseDto>> updateCoupon(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCouponRequestDto request) {
        return ApiResponses.ok(couponService.updateCoupon(id, request), "Cập nhật coupon thành công");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa coupon", description = "Xóa coupon theo ID — role ADMIN.")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable UUID id) {
        couponService.deleteCoupon(id);
        return ApiResponses.okMessage("Xóa coupon thành công");
    }
}
