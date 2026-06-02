package com.backend.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.orders.AdminOrderResponseDto;
import com.backend.enums.OrderStatus;
import com.backend.service.OrderService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
}
