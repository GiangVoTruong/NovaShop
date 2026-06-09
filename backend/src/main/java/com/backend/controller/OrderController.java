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
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.orders.CreateOrderRequestDto;
import com.backend.dto.orders.GetOrderResponseDto;
import com.backend.dto.orders.UpdateOrderStatusRequestDto;
import com.backend.service.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    @Operation(
            summary = "Tạo đơn hàng từ checkout",
            description = "Tạo đơn hàng mới dựa trên thông tin checkout và trả về chi tiết đơn.")
    public ResponseEntity<ApiResponse<GetOrderResponseDto>> checkout(@Valid @RequestBody CreateOrderRequestDto request) {
        return ApiResponses.created(orderService.checkout(request), "Đặt hàng thành công");
    }

    @GetMapping
    @Operation(
            summary = "Lấy danh sách đơn hàng của tôi",
            description = "Trả về toàn bộ đơn hàng thuộc người dùng hiện tại.")
    public ResponseEntity<ApiResponse<List<GetOrderResponseDto>>> getMyOrders() {
        return ApiResponses.ok(orderService.getMyOrders(), "Lấy danh sách đơn hàng thành công");
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Lấy chi tiết đơn hàng",
            description = "Trả về thông tin chi tiết của đơn hàng theo ID.")
    public ResponseEntity<ApiResponse<GetOrderResponseDto>> getOrderById(@PathVariable UUID id) {
        return ApiResponses.ok(orderService.getOrderById(id), "Lấy thông tin đơn hàng thành công");
    }

    @PostMapping("/{id}/cancel")
    @Operation(
            summary = "Hủy đơn hàng",
            description = "Hủy đơn hàng theo ID nếu đơn đang ở trạng thái cho phép hủy.")
    public ResponseEntity<ApiResponse<GetOrderResponseDto>> cancelOrder(@PathVariable UUID id) {
        return ApiResponses.ok(orderService.cancelOrder(id), "Hủy đơn hàng thành công");
    }

    @PostMapping("/{id}/confirm-received")
    @Operation(
            summary = "Khách xác nhận đã nhận hàng",
            description = "Chuyển đơn từ DELIVERED_PENDING_RECEIVER_CONFIRM sang DELIVERED.")
    public ResponseEntity<ApiResponse<GetOrderResponseDto>> confirmOrderReceived(@PathVariable UUID id) {
        return ApiResponses.ok(orderService.confirmOrderReceived(id), "Xác nhận đã nhận hàng thành công");
    }

    @PutMapping("/{id}/status")
    @Operation(
            summary = "Cập nhật trạng thái đơn hàng",
            description = "Cập nhật trạng thái xử lý của đơn hàng theo ID.")
    public ResponseEntity<ApiResponse<GetOrderResponseDto>> updateOrderStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOrderStatusRequestDto request) {
        return ApiResponses.ok(orderService.updateOrderStatus(id, request), "Cập nhật trạng thái đơn hàng thành công");
    }
}
