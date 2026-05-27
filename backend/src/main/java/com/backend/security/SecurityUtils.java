package com.backend.security;

import java.util.Arrays;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import com.backend.enums.UserRole;

public final class SecurityUtils {

    private static final String UNAUTHORIZED = "Unauthorized";

    private SecurityUtils() {
    }

    public static JwtUserPrincipal getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof JwtUserPrincipal principal)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, UNAUTHORIZED);
        }
        return principal;
    }

    public static UUID getCurrentUserId() {
        return getCurrentUser().userId();
    }

    public static void requireRole(UserRole... allowedRoles) {
        UserRole currentRole = getCurrentUser().role();
        boolean allowed = Arrays.stream(allowedRoles).anyMatch(role -> role == currentRole);
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
    }
}
