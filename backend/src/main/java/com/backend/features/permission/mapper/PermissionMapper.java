package com.backend.features.permission.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import com.backend.features.permission.dto.GetPermissionResponseDto;
import com.backend.features.permission.Permission;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface PermissionMapper {

    GetPermissionResponseDto toDto(Permission permission);
}
