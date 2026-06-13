package com.backend.features.order.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.order.dto.AdminOrderResponseDto;
import com.backend.features.order.dto.DeliverOrderRequestDto;
import com.backend.features.order.enums.OrderStatus;
import com.backend.features.order.service.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@Tag(name = "admin-orders")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(
            summary = "Danh sách đơn hàng (admin)",
            description = "Lấy danh sách toàn bộ đơn hàng có lọc, tìm kiếm và phân trang — role ADMIN.")
    public ResponseEntity<ApiResponse<List<AdminOrderResponseDto>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Page<AdminOrderResponseDto> orderPage = orderService.getAllOrdersAdmin(
                status, keyword, fromDate, toDate, page, size, sortBy, sortDir);
        return ApiResponses.okPage(orderPage, "Lấy danh sách đơn hàng thành công");
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Chi tiết đơn hàng (admin)",
            description = "Lấy chi tiết đơn hàng kèm danh sách items — role ADMIN.")
    public ResponseEntity<ApiResponse<AdminOrderResponseDto>> getOrderById(@PathVariable UUID id) {
        return ApiResponses.ok(orderService.getAdminOrderById(id), "Lấy thông tin đơn hàng thành công");
    }

    @PostMapping("/{id}/deliver")
    @Operation(
            summary = "Xác nhận giao hàng",
            description = "Chuyển đơn SHIPPING → DELIVERED kèm bằng chứng giao hàng — role ADMIN/SELLER.")
    public ResponseEntity<ApiResponse<AdminOrderResponseDto>> deliverOrder(
            @PathVariable UUID id,
            @Valid @RequestBody DeliverOrderRequestDto request) {
        return ApiResponses.ok(orderService.deliverOrder(id, request), "Xác nhận giao hàng thành công");
    }
}
