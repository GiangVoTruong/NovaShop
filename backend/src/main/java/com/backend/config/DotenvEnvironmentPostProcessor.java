package com.backend.config;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import io.github.cdimascio.dotenv.Dotenv;

/**
 * Nạp {@code backend/.env} vào Spring Environment mỗi lần context khởi tạo
 * (kể cả DevTools restart), để {@code ${VNPAY_TMN_CODE}} và các biến khác luôn có hiệu lực.
 */
public class DotenvEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String PROPERTY_SOURCE_NAME = "dotenv";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        Optional<Path> envFile = findEnvFile();
        if (envFile.isEmpty()) {
            return;
        }

        Path envPath = envFile.get();
        Dotenv dotenv = Dotenv.configure()
                .directory(envPath.getParent().toString())
                .filename(envPath.getFileName().toString())
                .ignoreIfMissing()
                .load();

        Map<String, Object> properties = new HashMap<>();
        dotenv.entries().forEach(entry -> properties.put(entry.getKey(), entry.getValue()));

        mapVnpayProperties(properties);
        mapStripeProperties(properties);
        mapGoogleProperties(properties);

        if (properties.isEmpty()) {
            return;
        }

        environment.getPropertySources().addFirst(new MapPropertySource(PROPERTY_SOURCE_NAME, properties));
    }

    /** Map biến .env sang {@code app.vnpay.*} để {@link VnpayProperties} luôn bind được. */
    private static void mapVnpayProperties(Map<String, Object> properties) {
        copyEnvProperty(properties, "VNPAY_TMN_CODE", "app.vnpay.tmn-code");
        copyEnvProperty(properties, "VNPAY_HASH_SECRET", "app.vnpay.hash-secret");
        copyEnvProperty(properties, "VNPAY_PAY_URL", "app.vnpay.pay-url");
        copyEnvProperty(properties, "VNPAY_RETURN_URL", "app.vnpay.return-url");
        copyEnvProperty(properties, "VNPAY_IPN_URL", "app.vnpay.ipn-url");
        copyEnvProperty(properties, "VNPAY_FRONTEND_REDIRECT", "app.vnpay.frontend-redirect-url");
    }

    private static void mapStripeProperties(Map<String, Object> properties) {
        copyEnvProperty(properties, "STRIPE_SECRET_KEY", "app.stripe.secret-key");
        copyEnvProperty(properties, "STRIPE_WEBHOOK_SECRET", "app.stripe.webhook-secret");
        copyEnvProperty(properties, "STRIPE_FRONTEND_REDIRECT", "app.stripe.frontend-redirect-url");
        copyEnvProperty(properties, "STRIPE_CURRENCY", "app.stripe.currency");
    }

    private static void mapGoogleProperties(Map<String, Object> properties) {
        copyEnvProperty(properties, "GOOGLE_CLIENT_ID", "app.google.client-id");
    }

    private static void copyEnvProperty(Map<String, Object> properties, String envKey, String springKey) {
        Object value = properties.get(envKey);
        if (value instanceof String stringValue && !stringValue.isBlank()) {
            properties.put(springKey, stringValue);
        }
    }

    /** Tìm .env khi chạy từ thư mục backend hoặc root monorepo. */
    private static Optional<Path> findEnvFile() {
        Path workingDirectory = Path.of("").toAbsolutePath().normalize();
        List<Path> candidates = List.of(
                workingDirectory.resolve(".env"),
                workingDirectory.resolve("backend").resolve(".env"),
                workingDirectory.getParent() != null
                        ? workingDirectory.getParent().resolve("backend").resolve(".env")
                        : workingDirectory.resolve(".env"));

        for (Path candidate : candidates) {
            if (Files.isRegularFile(candidate)) {
                return Optional.of(candidate);
            }
        }

        return Optional.empty();
    }
}
