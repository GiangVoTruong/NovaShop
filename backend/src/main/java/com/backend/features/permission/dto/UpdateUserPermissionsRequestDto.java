package com.backend.features.permission.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserPermissionsRequestDto {

    @NotNull(message = "Permission codes are required")
    private List<String> permissionCodes;
}
