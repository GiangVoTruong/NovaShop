package com.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.backend.config.UploadProperties;
import com.backend.dto.uploads.UploadFileResponseDto;
import com.backend.enums.UploadPurpose;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UploadService {

    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp");

    private final UploadProperties uploadProperties;

    public UploadFileResponseDto upload(MultipartFile file, UploadPurpose purpose) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
        }
        if (purpose == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Upload purpose is required");
        }
        if (file.getSize() > uploadProperties.getMaxFileSizeBytes()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File exceeds maximum size of 5MB");
        }

        String contentType = file.getContentType();
        if (!StringUtils.hasText(contentType) || !ALLOWED_MIME_TYPES.contains(contentType)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported file type");
        }

        String extension = resolveExtension(file.getOriginalFilename(), contentType);
        String storedFileName = purpose.name().toLowerCase() + "-" + UUID.randomUUID() + extension;

        try {
            Path uploadDirectory = Path.of(uploadProperties.getDirectory()).toAbsolutePath().normalize();
            Files.createDirectories(uploadDirectory);
            Path targetPath = uploadDirectory.resolve(storedFileName);
            file.transferTo(targetPath);

            String publicUrl = trimTrailingSlash(uploadProperties.getPublicBaseUrl()) + "/" + storedFileName;
            return UploadFileResponseDto.builder()
                    .url(publicUrl)
                    .fileName(storedFileName)
                    .size(file.getSize())
                    .mimeType(contentType)
                    .build();
        } catch (IOException ioException) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store uploaded file");
        }
    }

    private String resolveExtension(String originalFilename, String contentType) {
        if (StringUtils.hasText(originalFilename) && originalFilename.contains(".")) {
            return originalFilename.substring(originalFilename.lastIndexOf('.'));
        }
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }

    private String trimTrailingSlash(String value) {
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }
}
