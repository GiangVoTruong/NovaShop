package com.backend.support;

import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.backend.features.user.User;
import com.backend.common.enums.UserRole;
import com.backend.features.user.repository.UserRepository;
import com.backend.features.auth.security.JwtUserPrincipal;

public final class IntegrationTestAuth {

    private IntegrationTestAuth() {
    }

    public static User requireUser(UserRepository userRepository, String email) {
        return userRepository.findByEmailIgnoreCase(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalStateException("Test user not found: " + email));
    }

    public static void setSecurityContext(User user) {
        JwtUserPrincipal principal = new JwtUserPrincipal(user.getId(), user.getEmail(), user.getRole());
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, List.of()));
    }

    public static void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    public static String resolveTestUserEmail() {
        String email = System.getenv("TEST_USER_EMAIL");
        if (email == null || email.isBlank()) {
            email = System.getProperty("test.user.email");
        }
        return email;
    }

    public static boolean isAdmin(User user) {
        return user.getRole() == UserRole.ADMIN;
    }
}
