package com.backend.controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.products.CreateProductRequestDto;
import com.backend.dto.products.GetProductResponseDto;
import com.backend.dto.products.UpdateProductRequestDto;
import com.backend.security.SecurityUtils;
import com.backend.service.ProductService;
import com.backend.util.PaginationUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seller/products")
@RequiredArgsConstructor
@Tag(name = "seller-products")
public class SellerProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(
            summary = "Lấy sản phẩm của người bán hiện tại",
            description = "Trả về danh sách sản phẩm thuộc seller đang đăng nhập, có hỗ trợ phân trang và sắp xếp.")
    public ResponseEntity<ApiResponse<List<GetProductResponseDto>>> getMyProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        UUID sellerId = SecurityUtils.getCurrentUserId();
        return ApiResponses.okPage(
                productService.listProducts(
                        null, null, null, sellerId, PaginationUtils.toPageable(page, size, sortBy, sortDir)),
                "Lấy dữ liệu thành công");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Chi tiết sản phẩm seller", description = "Seller xem sản phẩm thuộc quyền sở hữu.")
    public ResponseEntity<ApiResponse<GetProductResponseDto>> getMyProductById(@PathVariable UUID id) {
        return ApiResponses.ok(productService.getManagedProductById(id), "Product loaded");
    }

    @PostMapping
    @Operation(summary = "Tạo sản phẩm seller", description = "Seller tạo sản phẩm mới.")
    public ResponseEntity<ApiResponse<GetProductResponseDto>> createProduct(
            @Valid @RequestBody CreateProductRequestDto request) {
        return ApiResponses.created(productService.createProduct(request), "Product created");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật sản phẩm seller", description = "Seller cập nhật sản phẩm thuộc quyền sở hữu.")
    public ResponseEntity<ApiResponse<GetProductResponseDto>> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProductRequestDto request) {
        return ApiResponses.ok(productService.updateProduct(id, request), "Product updated");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa sản phẩm seller", description = "Seller soft-delete sản phẩm thuộc quyền sở hữu.")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ApiResponses.okMessage("Product deleted");
    }
}

