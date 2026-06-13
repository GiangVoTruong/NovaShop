package com.backend.features.review.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReviewReplyRequestDto {

    @NotBlank(message = "Reply comment is required")
    @Size(max = 2000)
    private String comment;
}
