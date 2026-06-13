package com.backend.features.product.controller;

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

import com.backend.features.product.dto.CreateCategoryRequestDto;
import com.backend.features.product.dto.GetCategoryResponseDto;
import com.backend.features.product.dto.UpdateCategoryRequestDto;
import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.product.service.CategoryService;
import com.backend.features.product.service.ProductService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@SecurityRequirements
@Tag(name = "categories")
public class CategoryController {

    private final ProductService productService;
    private final CategoryService categoryService;

    @GetMapping
    @Operation(
            summary = "Lấy danh sách danh mục",
            description = "Trả về toàn bộ danh mục sản phẩm đang có trong hệ thống.")
    public ResponseEntity<ApiResponse<List<GetCategoryResponseDto>>> getAllCategories() {
        return ApiResponses.ok(productService.getAllCategories(), "Lấy danh mục thành công");
    }

    @PostMapping
    @Operation(summary = "Tạo danh mục", description = "Tạo danh mục mới — role ADMIN.")
    public ResponseEntity<ApiResponse<GetCategoryResponseDto>> createCategory(
            @Valid @RequestBody CreateCategoryRequestDto request) {
        return ApiResponses.created(categoryService.createCategory(request), "Tạo danh mục thành công");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật danh mục", description = "Cập nhật danh mục theo ID — role ADMIN.")
    public ResponseEntity<ApiResponse<GetCategoryResponseDto>> updateCategory(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCategoryRequestDto request) {
        return ApiResponses.ok(categoryService.updateCategory(id, request), "Cập nhật danh mục thành công");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa danh mục", description = "Xóa danh mục nếu không còn sản phẩm/con — role ADMIN.")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ApiResponses.okMessage("Xóa danh mục thành công");
    }
}
