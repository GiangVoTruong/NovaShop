package com.backend.features.product.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetCategoryResponseDto {

    private UUID id;
    private String name;
    private String slug;
    private UUID parentId;
    private String imageUrl;
}
