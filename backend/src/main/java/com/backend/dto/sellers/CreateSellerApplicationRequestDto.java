package com.backend.dto.sellers;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateSellerApplicationRequestDto {

    @NotBlank
    @Size(max = 150)
    private String shopName;

    @Size(max = 2000)
    private String description;
}
