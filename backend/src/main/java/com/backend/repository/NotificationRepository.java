package com.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.backend.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    Page<Notification> findByUser_IdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    long countByUser_IdAndIsReadFalse(UUID userId);

    Optional<Notification> findByIdAndUser_Id(UUID id, UUID userId);

    @Modifying
    @Query("UPDATE Notification notification SET notification.isRead = true WHERE notification.user.id = :userId AND notification.isRead = false")
    void markAllAsReadByUserId(@Param("userId") UUID userId);
}
