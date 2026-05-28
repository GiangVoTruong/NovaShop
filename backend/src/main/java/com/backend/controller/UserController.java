package com.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.permissions.GetUserPermissionsResponseDto;
import com.backend.dto.permissions.UpdateUserPermissionsRequestDto;
import com.backend.dto.users.CreateUserRequestDto;
import com.backend.dto.users.GetUserReponseDto;
import com.backend.service.PermissionService;
import com.backend.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PermissionService permissionService;

    @GetMapping
    @Operation(
            summary = "Lấy danh sách người dùng",
            description = "Trả về toàn bộ người dùng trong hệ thống.")
    public ResponseEntity<ApiResponse<List<GetUserReponseDto>>> getAllUsers() {
        return ApiResponses.ok(userService.getAllUsers(), "Lấy danh sách người dùng thành công");
    }

    @GetMapping("/me")
    @Operation(
            summary = "Lấy thông tin người dùng hiện tại",
            description = "Trả về thông tin hồ sơ của người dùng đang đăng nhập.")
    public ResponseEntity<ApiResponse<GetUserReponseDto>> getCurrentUser() {
        return ApiResponses.ok(userService.getCurrentUser(), "Lấy thông tin người dùng thành công");
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Lấy thông tin người dùng theo ID",
            description = "Trả về thông tin chi tiết của một người dùng theo UUID.")
    public ResponseEntity<ApiResponse<GetUserReponseDto>> getUserById(@PathVariable UUID id) {
        return ApiResponses.ok(userService.getUserById(id), "Lấy thông tin người dùng thành công");
    }

    @PostMapping
    @Operation(
            summary = "Tạo người dùng mới",
            description = "Tạo mới một tài khoản người dùng và trả về dữ liệu người dùng vừa tạo.")
    public ResponseEntity<ApiResponse<GetUserReponseDto>> createUser(@Valid @RequestBody CreateUserRequestDto request) {
        return ApiResponses.created(userService.createUser(request), "Tạo người dùng thành công");
    }

    @GetMapping("/{id}/permissions")
    @Operation(
            summary = "Lấy quyền của người dùng",
            description = "Trả về danh sách permission đang được gán cho người dùng theo ID.")
    public ResponseEntity<ApiResponse<GetUserPermissionsResponseDto>> getUserPermissions(@PathVariable UUID id) {
        return ApiResponses.ok(permissionService.getUserPermissions(id), "Lấy quyền người dùng thành công");
    }

    @PutMapping("/{id}/permissions")
    @Operation(
            summary = "Cập nhật quyền người dùng",
            description = "Gán lại danh sách permission cho người dùng theo ID.")
    public ResponseEntity<ApiResponse<GetUserPermissionsResponseDto>> assignUserPermissions(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUserPermissionsRequestDto request) {
        return ApiResponses.ok(
                permissionService.assignUserPermissions(id, request.getPermissionCodes()),
                "Cập nhật quyền người dùng thành công");
    }
}
