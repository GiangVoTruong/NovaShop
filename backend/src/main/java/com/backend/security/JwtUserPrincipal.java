package com.backend.security;

import java.security.Principal;
import java.util.UUID;

import com.backend.enums.UserRole;

public record JwtUserPrincipal(UUID userId, String email, UserRole role) implements Principal {

    @Override
    public String getName() {
        return userId.toString();
    }
}
