package com.backend.features.auth.service;

import java.util.Collections;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.backend.config.GoogleProperties;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GoogleTokenVerifierService {

    private static final String INVALID_GOOGLE_TOKEN = "Invalid Google token";
    private static final String GOOGLE_NOT_CONFIGURED = "Google login is not configured";

    private final GoogleProperties googleProperties;

    public VerifiedGoogleProfile verify(String idTokenString) {
        assertConfigured();

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleProperties.getClientId()))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_GOOGLE_TOKEN);
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            if (!StringUtils.hasText(email)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_GOOGLE_TOKEN);
            }

            return new VerifiedGoogleProfile(
                    payload.getSubject(),
                    email,
                    payload.get("name") instanceof String name ? name : null,
                    payload.get("picture") instanceof String picture ? picture : null,
                    Boolean.TRUE.equals(payload.getEmailVerified()));
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_GOOGLE_TOKEN);
        }
    }

    private void assertConfigured() {
        if (!StringUtils.hasText(googleProperties.getClientId())) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, GOOGLE_NOT_CONFIGURED);
        }
    }

    public record VerifiedGoogleProfile(
            String googleId,
            String email,
            String fullName,
            String avatarUrl,
            boolean emailVerified) {
    }
}
