package com.backend.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.dto.users.CreateUserRequestDto;
import com.backend.dto.users.GetUserReponseDto;
import com.backend.dto.users.UpdateUserProfileRequestDto;
import com.backend.entity.User;
import com.backend.mapper.UserMapper;
import com.backend.repository.UserRepository;
import com.backend.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationService emailVerificationService;

    @Transactional(readOnly = true)
    public List<GetUserReponseDto> getAllUsers() {
        return userMapper.toDtoList(userRepository.findAll());
    }

    @Transactional(readOnly = true)
    public GetUserReponseDto getUserById(UUID id) {
        return userMapper.toDto(userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")));
    }

    @Transactional(readOnly = true)
    public GetUserReponseDto getCurrentUser() {
        return getUserById(SecurityUtils.getCurrentUserId());
    }

    @Transactional
    public GetUserReponseDto updateCurrentUser(UpdateUserProfileRequestDto request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone().trim());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setUpdatedAt(OffsetDateTime.now());
        return userMapper.toDto(userRepository.save(user));
    }

    @Transactional
    public GetUserReponseDto createUser(CreateUserRequestDto request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        OffsetDateTime now = OffsetDateTime.now();
        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(request.getRole())
                .isActive(false)
                .createdAt(now)
                .updatedAt(now)
                .build();

        User savedUser = userRepository.save(user);
        emailVerificationService.sendVerificationForUser(savedUser);

        return userMapper.toDto(savedUser);
    }
}
