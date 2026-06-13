package com.backend.features.inventory.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.inventory.dto.AdminInventoryItemResponseDto;
import com.backend.features.inventory.dto.AdminInventorySummaryResponseDto;
import com.backend.features.inventory.service.InventoryService;
import com.backend.common.util.PaginationUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/inventory")
@RequiredArgsConstructor
@Tag(name = "admin-inventory")
public class AdminInventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @Operation(summary = "Danh sách tồn kho", description = "Lọc và phân trang sản phẩm theo tồn kho — role ADMIN.")
    public ResponseEntity<ApiResponse<List<AdminInventoryItemResponseDto>>> listInventory(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean lowStockOnly,
            @RequestParam(required = false) Boolean outOfStockOnly,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "stock") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ApiResponses.okPage(
                inventoryService.listInventory(keyword, lowStockOnly, outOfStockOnly,
                        PaginationUtils.toPageable(page, size, sortBy, sortDir)),
                "Inventory loaded");
    }

    @GetMapping("/summary")
    @Operation(summary = "Tổng quan tồn kho", description = "Thống kê SKU, low stock, out of stock — role ADMIN.")
    public ResponseEntity<ApiResponse<AdminInventorySummaryResponseDto>> getSummary() {
        return ApiResponses.ok(inventoryService.getSummary(), "Inventory summary loaded");
    }
}
