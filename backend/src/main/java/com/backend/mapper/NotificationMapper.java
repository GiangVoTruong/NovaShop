package com.backend.mapper;

import java.util.ArrayList;
import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.backend.dto.notifications.GetNotificationResponseDto;
import com.backend.entity.Notification;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface NotificationMapper {

    GetNotificationResponseDto toDto(Notification notification);

    default List<GetNotificationResponseDto> toDtoList(List<Notification> notifications) {
        if (notifications == null) {
            return null;
        }
        List<GetNotificationResponseDto> list = new ArrayList<>(notifications.size());
        for (Notification notification : notifications) {
            list.add(toDto(notification));
        }
        return list;
    }
}
