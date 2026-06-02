package com.backend.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.wishlist.AddWishlistItemRequestDto;
import com.backend.dto.wishlist.GetWishlistItemResponseDto;
import com.backend.dto.wishlist.GetWishlistResponseDto;
import com.backend.dto.wishlist.WishlistCheckResponseDto;
import com.backend.service.WishlistService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@Tag(name = "wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    @Operation(summary = "Lấy wishlist", description = "Trả về danh sách sản phẩm yêu thích của user đang đăng nhập.")
    public ResponseEntity<ApiResponse<GetWishlistResponseDto>> getMyWishlist() {
        return ApiResponses.ok(wishlistService.getMyWishlist(), "Lấy wishlist thành công");
    }

    @PostMapping("/items")
    @Operation(summary = "Thêm vào wishlist", description = "Thêm sản phẩm vào wishlist (idempotent nếu đã có).")
    public ResponseEntity<ApiResponse<GetWishlistItemResponseDto>> addItem(
            @Valid @RequestBody AddWishlistItemRequestDto request) {
        return ApiResponses.created(wishlistService.addItem(request.getProductId()), "Thêm wishlist thành công");
    }

    @DeleteMapping("/items/{productId}")
    @Operation(summary = "Xóa khỏi wishlist", description = "Xóa sản phẩm khỏi wishlist theo productId.")
    public ResponseEntity<ApiResponse<Void>> removeItem(@PathVariable UUID productId) {
        wishlistService.removeItem(productId);
        return ApiResponses.okMessage("Xóa khỏi wishlist thành công");
    }

    @GetMapping("/check/{productId}")
    @Operation(summary = "Kiểm tra wishlist", description = "Kiểm tra sản phẩm có trong wishlist hay không.")
    public ResponseEntity<ApiResponse<WishlistCheckResponseDto>> checkProduct(@PathVariable UUID productId) {
        return ApiResponses.ok(wishlistService.checkProduct(productId), "Kiểm tra wishlist thành công");
    }
}
