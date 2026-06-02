package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.coupons.ValidateCouponRequestDto;
import com.backend.dto.coupons.ValidateCouponResponseDto;
import com.backend.service.CouponService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@Tag(name = "coupons")
public class CouponController {

    private final CouponService couponService;

    @PostMapping("/validate")
    @Operation(summary = "Validate coupon", description = "Kiểm tra mã giảm giá và tính discountAmount.")
    public ResponseEntity<ApiResponse<ValidateCouponResponseDto>> validateCoupon(
            @Valid @RequestBody ValidateCouponRequestDto request) {
        ValidateCouponResponseDto response = couponService.validate(request.getCode(), request.getCartTotal());
        return ApiResponses.ok(response, "Validate coupon thành công");
    }
}
