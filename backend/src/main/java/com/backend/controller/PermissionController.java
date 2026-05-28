package com.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.common.ApiResponse;
import com.backend.dto.common.ApiResponses;
import com.backend.dto.permissions.GetPermissionResponseDto;
import com.backend.service.PermissionService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

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

