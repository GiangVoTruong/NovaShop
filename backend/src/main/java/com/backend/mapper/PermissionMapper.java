package com.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.backend.dto.permissions.GetPermissionResponseDto;
import com.backend.entity.Permission;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface PermissionMapper {

    GetPermissionResponseDto toDto(Permission permission);
}
