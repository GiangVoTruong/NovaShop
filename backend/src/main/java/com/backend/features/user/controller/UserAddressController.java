package com.backend.features.user.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.features.user.dto.CreateAddressRequestDto;
import com.backend.features.user.dto.GetAddressResponseDto;
import com.backend.features.user.dto.UpdateAddressRequestDto;
import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.user.service.AddressService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import com.backend.features.user.User;
@RestController
@RequestMapping("/api/users/me/addresses")
@RequiredArgsConstructor
@Tag(name = "addresses")
public class UserAddressController {

    private final AddressService addressService;

    @GetMapping
    @Operation(summary = "Lấy địa chỉ của tôi", description = "Trả về danh sách địa chỉ giao hàng của user đang đăng nhập.")
    public ResponseEntity<ApiResponse<List<GetAddressResponseDto>>> getMyAddresses() {
        return ApiResponses.ok(addressService.getMyAddresses(), "Lấy danh sách địa chỉ thành công");
    }

    @PostMapping
    @Operation(summary = "Thêm địa chỉ", description = "Tạo địa chỉ giao hàng mới cho user đang đăng nhập.")
    public ResponseEntity<ApiResponse<GetAddressResponseDto>> createAddress(
            @Valid @RequestBody CreateAddressRequestDto request) {
        return ApiResponses.created(addressService.createAddress(request), "Tạo địa chỉ thành công");
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật địa chỉ", description = "Cập nhật địa chỉ thuộc user đang đăng nhập.")
    public ResponseEntity<ApiResponse<GetAddressResponseDto>> updateAddress(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAddressRequestDto request) {
        return ApiResponses.ok(addressService.updateAddress(id, request), "Cập nhật địa chỉ thành công");
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa địa chỉ", description = "Xóa địa chỉ thuộc user đang đăng nhập.")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(@PathVariable UUID id) {
        addressService.deleteAddress(id);
        return ApiResponses.okMessage("Xóa địa chỉ thành công");
    }

    @PatchMapping("/{id}/default")
    @Operation(summary = "Đặt địa chỉ mặc định", description = "Đặt địa chỉ mặc định và bỏ default các địa chỉ khác.")
    public ResponseEntity<ApiResponse<GetAddressResponseDto>> setDefaultAddress(@PathVariable UUID id) {
        return ApiResponses.ok(addressService.setDefaultAddress(id), "Cập nhật địa chỉ mặc định thành công");
    }
}
