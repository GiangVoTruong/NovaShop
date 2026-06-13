package com.backend.features.analytics.controller;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.features.analytics.dto.AdminAnalyticsSummaryResponseDto;
import com.backend.features.analytics.dto.GetAnalyticsOverviewResponseDto;
import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.analytics.service.AnalyticsService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
@Tag(name = "admin-analytics")
public class AdminAnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/overview")
    @Operation(summary = "Analytics overview", description = "Tổng quan dashboard — role ADMIN.")
    public ResponseEntity<ApiResponse<GetAnalyticsOverviewResponseDto>> getOverview(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
        return ApiResponses.ok(
                analyticsService.getOverview(fromDate, toDate),
                "Lấy analytics overview thành công");
    }

    @GetMapping("/summary")
    @Operation(summary = "Analytics summary", description = "Số liệu nhanh sidebar admin — role ADMIN.")
    public ResponseEntity<ApiResponse<AdminAnalyticsSummaryResponseDto>> getSummary() {
        return ApiResponses.ok(analyticsService.getSummary(), "Lấy analytics summary thành công");
    }
}
