package com.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.categories.GetCategoryResponseDto;
import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@SecurityRequirements
public class CategoryController {

    private final ProductService productService;

    @GetMapping
    @Operation(
            summary = "Lấy danh sách danh mục",
            description = "Trả về toàn bộ danh mục sản phẩm đang có trong hệ thống.")
    public ResponseEntity<ApiResponse<List<GetCategoryResponseDto>>> getAllCategories() {
        return ApiResponses.ok(productService.getAllCategories(), "Lấy danh mục thành công");
    }
}
