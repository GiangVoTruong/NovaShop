package com.backend.security;

import java.util.UUID;

import com.backend.enums.UserRole;

public record JwtUserPrincipal(UUID userId, String email, UserRole role) {
}
