package com.backend.features.search.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.search.dto.AdminSearchResponseDto;
import com.backend.features.search.service.AdminSearchService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/search")
@RequiredArgsConstructor
@Tag(name = "admin-search")
public class AdminSearchController {

    private final AdminSearchService adminSearchService;

    @GetMapping
    @Operation(summary = "Tìm kiếm toàn cục admin", description = "Tìm đơn hàng, sản phẩm, khách hàng theo từ khóa.")
    public ResponseEntity<ApiResponse<AdminSearchResponseDto>> search(
            @RequestParam("q") String query,
            @RequestParam(defaultValue = "10") int limit) {
        return ApiResponses.ok(adminSearchService.search(query, limit), "Search completed");
    }
}
