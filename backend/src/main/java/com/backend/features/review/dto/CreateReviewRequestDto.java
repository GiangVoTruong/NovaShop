package com.backend.features.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReviewRequestDto {

    @NotNull(message = "Rating is required")
    @Min(1)
    @Max(5)
    private Short rating;

    @Size(max = 2000)
    private String comment;
}
