package com.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.orders.GetOrderResponseDto;
import com.backend.service.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seller/orders")
@RequiredArgsConstructor
@Tag(name = "seller-orders")
public class SellerOrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(
            summary = "Đơn hàng liên quan seller",
            description = "Trả về đơn có ít nhất một item thuộc sản phẩm của seller hiện tại.")
    public ResponseEntity<ApiResponse<List<GetOrderResponseDto>>> getSellerOrders() {
        return ApiResponses.ok(orderService.getSellerOrders(), "Seller orders loaded");
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Chi tiết đơn seller",
            description = "Chỉ truy cập đơn có sản phẩm thuộc seller hiện tại.")
    public ResponseEntity<ApiResponse<GetOrderResponseDto>> getSellerOrderById(@PathVariable UUID id) {
        return ApiResponses.ok(orderService.getSellerOrderById(id), "Seller order loaded");
    }
}
