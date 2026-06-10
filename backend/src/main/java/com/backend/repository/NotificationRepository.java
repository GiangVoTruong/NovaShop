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

    @Query("""
            SELECT notification FROM Notification notification
            WHERE notification.user.id = :userId
            ORDER BY notification.createdAt DESC
            """)
    Page<Notification> findByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId, Pageable pageable);

    @Query("""
            SELECT COUNT(notification) FROM Notification notification
            WHERE notification.user.id = :userId AND notification.isRead = false
            """)
    long countUnreadByUserId(@Param("userId") UUID userId);

    @Query("""
            SELECT notification FROM Notification notification
            WHERE notification.id = :id AND notification.user.id = :userId
            """)
    Optional<Notification> findByIdAndUserId(@Param("id") UUID id, @Param("userId") UUID userId);

    @Modifying
    @Query("""
            UPDATE Notification notification
            SET notification.isRead = true
            WHERE notification.user.id = :userId AND notification.isRead = false
            """)
    void markAllAsReadByUserId(@Param("userId") UUID userId);

    boolean existsByUser_IdAndTitleAndMessage(UUID userId, String title, String message);

    Optional<Notification> findTopByUser_IdAndTitleAndMessageOrderByCreatedAtDesc(
            UUID userId, String title, String message);
}
