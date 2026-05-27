package com.backend.controller;

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
import com.backend.service.ProductService;
import com.backend.util.PaginationUtils;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<java.util.List<GetProductResponseDto>>> listProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String mode,
            @RequestParam(required = false) UUID sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ApiResponses.okPage(
                productService.listProducts(
                        keyword, category, mode, sellerId, PaginationUtils.toPageable(page, size, sortBy, sortDir)),
                "Lấy dữ liệu thành công");
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<GetProductResponseDto>> getProductBySlug(@PathVariable String slug) {
        return ApiResponses.ok(productService.getProductBySlug(slug), "Lấy dữ liệu thành công");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GetProductResponseDto>> getProductById(@PathVariable UUID id) {
        return ApiResponses.ok(productService.getProductById(id), "Lấy dữ liệu thành công");
    }

    @PostMapping
    public ResponseEntity<ApiResponse<GetProductResponseDto>> createProduct(@Valid @RequestBody CreateProductRequestDto request) {
        return ApiResponses.created(productService.createProduct(request), "Tạo sản phẩm thành công");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GetProductResponseDto>> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProductRequestDto request) {
        return ApiResponses.ok(productService.updateProduct(id, request), "Cập nhật sản phẩm thành công");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ApiResponses.okMessage("Xóa sản phẩm thành công");
    }
}
