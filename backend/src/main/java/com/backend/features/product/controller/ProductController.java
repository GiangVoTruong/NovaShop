package com.backend.features.product.controller;

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

import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.product.dto.CreateProductRequestDto;
import com.backend.features.product.dto.GetProductResponseDto;
import com.backend.features.product.dto.UpdateProductRequestDto;
import com.backend.features.product.service.ProductService;
import com.backend.common.util.PaginationUtils;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.backend.features.product.Category;
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "products")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(
            summary = "Lấy danh sách sản phẩm",
            description = "Trả về danh sách sản phẩm có hỗ trợ lọc theo từ khóa, danh mục, chế độ, người bán và phân trang.")
    @SecurityRequirements
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
    @Operation(
            summary = "Lấy chi tiết sản phẩm theo slug",
            description = "Trả về thông tin chi tiết của một sản phẩm bằng slug thân thiện URL.")
    @SecurityRequirements
    public ResponseEntity<ApiResponse<GetProductResponseDto>> getProductBySlug(@PathVariable String slug) {
        return ApiResponses.ok(productService.getProductBySlug(slug), "Lấy dữ liệu thành công");
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Lấy chi tiết sản phẩm theo ID",
            description = "Trả về thông tin chi tiết của một sản phẩm bằng định danh UUID.")
    @SecurityRequirements
    public ResponseEntity<ApiResponse<GetProductResponseDto>> getProductById(@PathVariable UUID id) {
        return ApiResponses.ok(productService.getProductById(id), "Lấy dữ liệu thành công");
    }

    @PostMapping
    @Operation(
            summary = "Tạo sản phẩm mới",
            description = "Tạo một sản phẩm mới từ thông tin đầu vào và trả về dữ liệu sản phẩm vừa tạo.")
    public ResponseEntity<ApiResponse<GetProductResponseDto>> createProduct(@Valid @RequestBody CreateProductRequestDto request) {
        return ApiResponses.created(productService.createProduct(request), "Tạo sản phẩm thành công");
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Cập nhật sản phẩm",
            description = "Cập nhật thông tin của sản phẩm theo ID và trả về dữ liệu sau khi cập nhật.")
    public ResponseEntity<ApiResponse<GetProductResponseDto>> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProductRequestDto request) {
        return ApiResponses.ok(productService.updateProduct(id, request), "Cập nhật sản phẩm thành công");
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Xóa sản phẩm",
            description = "Xóa sản phẩm theo ID.")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ApiResponses.okMessage("Xóa sản phẩm thành công");
    }
}

