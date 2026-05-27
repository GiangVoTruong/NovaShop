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
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.cart.AddCartItemRequestDto;
import com.backend.dto.cart.GetCartResponseDto;
import com.backend.dto.cart.UpdateCartItemRequestDto;
import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.service.CartService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<GetCartResponseDto>> getMyCart() {
        return ApiResponses.ok(cartService.getMyCart(), "Lấy giỏ hàng thành công");
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<GetCartResponseDto>> addItem(@Valid @RequestBody AddCartItemRequestDto request) {
        return ApiResponses.ok(cartService.addItem(request), "Thêm sản phẩm vào giỏ hàng thành công");
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<GetCartResponseDto>> updateItem(
            @PathVariable UUID itemId,
            @Valid @RequestBody UpdateCartItemRequestDto request) {
        return ApiResponses.ok(cartService.updateItem(itemId, request), "Cập nhật giỏ hàng thành công");
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<GetCartResponseDto>> removeItem(@PathVariable UUID itemId) {
        return ApiResponses.ok(cartService.removeItem(itemId), "Xóa sản phẩm khỏi giỏ hàng thành công");
    }
}
