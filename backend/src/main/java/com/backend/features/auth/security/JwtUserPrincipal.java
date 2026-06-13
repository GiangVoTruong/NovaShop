package com.backend.features.auth.security;

import java.security.Principal;
import java.util.UUID;

import com.backend.common.enums.UserRole;

public record JwtUserPrincipal(UUID userId, String email, UserRole role) implements Principal {

    @Override
    public String getName() {
        return userId.toString();
    }
}
