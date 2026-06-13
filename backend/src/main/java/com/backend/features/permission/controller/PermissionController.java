package com.backend.features.permission.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.permission.dto.GetPermissionResponseDto;
import com.backend.features.permission.service.PermissionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import com.backend.features.permission.Permission;
@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
@Tag(name = "permissions")
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    @Operation(
            summary = "Lấy danh sách quyền hệ thống",
            description = "Trả về toàn bộ permission có trong hệ thống để phục vụ phân quyền.")
    public ResponseEntity<ApiResponse<List<GetPermissionResponseDto>>> getAllPermissions() {
        return ApiResponses.ok(permissionService.getAllPermissions(), "Lấy danh sách quyền thành công");
    }
}

