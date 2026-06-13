package com.backend.features.product.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateProductRequestDto {

    @NotBlank
    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String slug;

    private String description;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal price;

    @DecimalMin("0.0")
    private BigDecimal discountPrice;

    @NotNull
    @Min(0)
    private Integer stock;

    @NotNull
    private UUID categoryId;

    @Size(max = 10)
    private List<@NotBlank @Size(max = 500) String> imageUrls;
}
