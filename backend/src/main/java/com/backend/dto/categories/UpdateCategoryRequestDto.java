package com.backend.dto.categories;

import java.util.UUID;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateCategoryRequestDto {

    @Size(max = 100)
    private String name;

    @Size(max = 100)
    private String slug;

    private UUID parentId;
}
