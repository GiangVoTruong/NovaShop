package com.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.backend.entity.UserPermission;
import com.backend.entity.UserPermissionId;

public interface UserPermissionRepository extends JpaRepository<UserPermission, UserPermissionId> {

    @Query("""
            SELECT permission.code FROM UserPermission userPermission
            JOIN userPermission.permission permission
            WHERE userPermission.user.id = :userId
            ORDER BY permission.module ASC, permission.code ASC
            """)
    List<String> findPermissionCodesByUserId(UUID userId);

    @Modifying
    @Query("DELETE FROM UserPermission userPermission WHERE userPermission.user.id = :userId")
    void deleteByUserId(UUID userId);
}
