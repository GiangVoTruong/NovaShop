package com.backend.controller;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.JacksonJsonHttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.backend.features.review.controller.ReviewController;
import com.backend.features.review.dto.GetReviewResponseDto;
import com.backend.features.review.enums.ReviewStatus;
import com.backend.features.review.service.ReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
@ExtendWith(MockitoExtension.class)
class ReviewControllerTest {

    private static final UUID PRODUCT_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");
    private static final UUID REVIEW_ID = UUID.fromString("55555555-5555-5555-5555-555555555555");

    @Mock
    private ReviewService reviewService;

    @InjectMocks
    private ReviewController reviewController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private MockMvc mockMvc() {
        if (mockMvc == null) {
            mockMvc = MockMvcBuilders.standaloneSetup(reviewController)
                    .setMessageConverters(new JacksonJsonHttpMessageConverter())
                    .build();
            objectMapper = new ObjectMapper();
            objectMapper.findAndRegisterModules();
        }
        return mockMvc;
    }

    private ObjectMapper objectMapper() {
        mockMvc();
        return objectMapper;
    }

    @Test
    void createReview_returns201() throws Exception {
        GetReviewResponseDto response = GetReviewResponseDto.builder()
                .id(REVIEW_ID)
                .productId(PRODUCT_ID)
                .rating((short) 5)
                .comment("Excellent")
                .status(ReviewStatus.VISIBLE)
                .createdAt(OffsetDateTime.now())
                .build();
        when(reviewService.createReview(eq(PRODUCT_ID), org.mockito.ArgumentMatchers.any()))
                .thenReturn(response);

        String body = objectMapper().writeValueAsString(
                java.util.Map.of("rating", 5, "comment", "Excellent"));

        mockMvc().perform(post("/api/products/{productId}/reviews", PRODUCT_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.comment").value("Excellent"));

        verify(reviewService).createReview(eq(PRODUCT_ID), org.mockito.ArgumentMatchers.any());
    }

    @Test
    void createReview_returns400WhenRatingInvalid() throws Exception {
        String body = objectMapper().writeValueAsString(java.util.Map.of("rating", 0));

        mockMvc().perform(post("/api/products/{productId}/reviews", PRODUCT_ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteReview_returns200() throws Exception {
        mockMvc().perform(delete("/api/reviews/{id}", REVIEW_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Xóa review thành công"));

        verify(reviewService).deleteReview(REVIEW_ID);
    }
}
