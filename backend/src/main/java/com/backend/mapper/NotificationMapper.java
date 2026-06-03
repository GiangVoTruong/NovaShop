package com.backend.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.backend.dto.notifications.GetNotificationResponseDto;
import com.backend.entity.Notification;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface NotificationMapper {

    GetNotificationResponseDto toDto(Notification notification);

    List<GetNotificationResponseDto> toDtoList(List<Notification> notifications);
}
