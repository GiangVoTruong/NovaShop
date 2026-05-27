package com.backend.dto.products;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.backend.enums.ProductStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProductRequestDto {

    @Size(max = 255)
    private String name;

    private String description;

    @DecimalMin("0.0")
    private BigDecimal price;

    @DecimalMin("0.0")
    private BigDecimal discountPrice;

    @Min(0)
    private Integer stock;

    private UUID categoryId;

    private ProductStatus status;

    @Size(max = 10)
    private List<@Size(max = 500) String> imageUrls;
}
