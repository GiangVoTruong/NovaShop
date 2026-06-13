package com.backend.features.upload.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.backend.common.dto.ApiResponse;
import com.backend.common.dto.ApiResponses;
import com.backend.features.upload.dto.UploadFileResponseDto;
import com.backend.features.upload.enums.UploadPurpose;
import com.backend.features.upload.service.UploadService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
@Tag(name = "uploads")
public class UploadController {

    private final UploadService uploadService;

    @PostMapping(consumes = "multipart/form-data")
    @Operation(summary = "Upload file", description = "Upload ảnh sản phẩm, avatar hoặc bằng chứng giao hàng.")
    public ResponseEntity<ApiResponse<UploadFileResponseDto>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("purpose") UploadPurpose purpose) {
        return ApiResponses.ok(uploadService.upload(file, purpose), "File uploaded successfully");
    }
}
