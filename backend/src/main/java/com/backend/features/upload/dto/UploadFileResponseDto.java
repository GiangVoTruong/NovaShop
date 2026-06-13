package com.backend.features.upload.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UploadFileResponseDto {

    private String url;
    private String fileName;
    private long size;
    private String mimeType;
}
