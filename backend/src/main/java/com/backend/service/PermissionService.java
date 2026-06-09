package com.backend.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.dto.permissions.GetPermissionResponseDto;
import com.backend.dto.permissions.GetUserPermissionsResponseDto;
import com.backend.entity.Permission;
import com.backend.entity.User;
import com.backend.entity.UserPermission;
import com.backend.entity.UserPermissionId;
import com.backend.mapper.PermissionMapper;
import com.backend.repository.PermissionRepository;
import com.backend.repository.UserPermissionRepository;
import com.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private static final String PERMISSION_NOT_FOUND = "One or more permissions not found";
    private static final String PERMISSIONS_ONLY_FOR_ADMIN_PORTAL = "Permissions apply only to admin portal users";

    private final PermissionRepository permissionRepository;
    private final UserPermissionRepository userPermissionRepository;
    private final UserRepository userRepository;
    private final PermissionMapper permissionMapper;

    @Transactional(readOnly = true)
    public List<GetPermissionResponseDto> getAllPermissions() {
        List<Permission> permissions = permissionRepository.findAllByOrderByModuleAscCodeAsc();
        List<GetPermissionResponseDto> response = new ArrayList<>(permissions.size());
        for (Permission permission : permissions) {
            response.add(permissionMapper.toDto(permission));
        }
        return response;
    }

    @Transactional(readOnly = true)
    public GetUserPermissionsResponseDto getUserPermissions(UUID userId) {
        User user = findUser(userId);
        assertAdminPortalUser(user);
        return GetUserPermissionsResponseDto.builder()
                .permissionCodes(userPermissionRepository.findPermissionCodesByUserId(userId))
                .build();
    }

    @Transactional(readOnly = true)
    public List<String> getPermissionCodesForUser(User user) {
        if (!user.getRole().isAdminPortal()) {
            return List.of();
        }
        return userPermissionRepository.findPermissionCodesByUserId(user.getId());
    }

    @Transactional
    public GetUserPermissionsResponseDto assignUserPermissions(UUID userId, List<String> permissionCodes) {
        User user = findUser(userId);
        assertAdminPortalUser(user);

        Set<String> uniqueCodes = new LinkedHashSet<>();
        for (String code : permissionCodes) {
            if (code == null) {
                continue;
            }
            String trimmedCode = code.trim();
            if (!trimmedCode.isBlank()) {
                uniqueCodes.add(trimmedCode);
            }
        }
        List<String> normalizedCodes = List.copyOf(uniqueCodes);

        List<Permission> permissions = permissionRepository.findByCodeIn(normalizedCodes);
        if (permissions.size() != normalizedCodes.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, PERMISSION_NOT_FOUND);
        }

        userPermissionRepository.deleteByUserId(userId);

        List<UserPermission> userPermissions = new ArrayList<>();
        for (Permission permission : permissions) {
            userPermissions.add(UserPermission.builder()
                    .id(new UserPermissionId(userId, permission.getId()))
                    .user(user)
                    .permission(permission)
                    .build());
        }

        userPermissionRepository.saveAll(userPermissions);

        return GetUserPermissionsResponseDto.builder()
                .permissionCodes(normalizedCodes)
                .build();
    }

    private User findUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private void assertAdminPortalUser(User user) {
        if (!user.getRole().isAdminPortal()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, PERMISSIONS_ONLY_FOR_ADMIN_PORTAL);
        }
    }
}
