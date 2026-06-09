package com.backend.config;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import com.backend.security.JwtService;
import com.backend.security.JwtUserPrincipal;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtHandshakeHandler extends DefaultHandshakeHandler {

    private final JwtService jwtService;

    @Override
    protected Principal determineUser(
            ServerHttpRequest request,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {
        String token = resolveToken(request);
        if (token != null && jwtService.isTokenValid(token)) {
            JwtUserPrincipal principal = jwtService.extractPrincipal(token);
            attributes.put("userId", principal.userId().toString());
            return principal;
        }
        return super.determineUser(request, wsHandler, attributes);
    }

    private String resolveToken(ServerHttpRequest request) {
        if (!(request instanceof ServletServerHttpRequest servletRequest)) {
            return null;
        }

        HttpServletRequest httpRequest = servletRequest.getServletRequest();

        String accessToken = httpRequest.getParameter("access_token");
        if (accessToken != null && !accessToken.isBlank()) {
            return accessToken;
        }

        String authorization = httpRequest.getHeader("Authorization");
        if (authorization != null && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }

        return null;
    }
}
