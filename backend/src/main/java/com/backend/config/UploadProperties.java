package com.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "app.upload")
public class UploadProperties {

    private String directory = "uploads";
    private String publicBaseUrl = "http://localhost:8080/uploads";
    private long maxFileSizeBytes = 5 * 1024 * 1024;
}
