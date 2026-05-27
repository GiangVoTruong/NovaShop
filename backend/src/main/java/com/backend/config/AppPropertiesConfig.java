package com.backend.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({VerificationProperties.class, MailProperties.class})
public class AppPropertiesConfig {
}
