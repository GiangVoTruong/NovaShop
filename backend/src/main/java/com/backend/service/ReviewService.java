package com.backend.service;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.dto.reviews.CreateReviewRequestDto;
import com.backend.dto.reviews.GetReviewResponseDto;
import com.backend.entity.Review;
import com.backend.entity.User;
import com.backend.repository.OrderRepository;
import com.backend.repository.ProductRepository;
import com.backend.repository.ReviewRepository;
import com.backend.repository.UserRepository;
import com.backend.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private static final String PRODUCT_NOT_FOUND = "Product not found";
    private static final String REVIEW_NOT_FOUND = "Review not found";
    private static final String REVIEW_ALREADY_EXISTS = "You have already reviewed this product";
    private static final String REVIEW_NOT_ALLOWED = "You can only review products from delivered orders";

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public Page<GetReviewResponseDto> getProductReviews(UUID productId, Pageable pageable) {
        assertProductExists(productId);
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable)
                .map(review -> toDto(review));
    }

    @Transactional
    public GetReviewResponseDto createReview(UUID productId, CreateReviewRequestDto request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
        assertProductExists(productId);

        if (reviewRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, REVIEW_ALREADY_EXISTS);
        }
        if (!orderRepository.hasDeliveredOrderWithProduct(userId, productId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, REVIEW_NOT_ALLOWED);
        }

        Review review = Review.builder()
                .user(user)
                .product(productRepository.getReferenceById(productId))
                .rating(request.getRating())
                .createdAt(OffsetDateTime.now())
                .build();
        return toDto(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(UUID reviewId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        Review review = reviewRepository.findByIdAndUserId(reviewId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, REVIEW_NOT_FOUND));
        reviewRepository.delete(review);
    }

    private void assertProductExists(UUID productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, PRODUCT_NOT_FOUND);
        }
    }

    private GetReviewResponseDto toDto(Review review) {
        return GetReviewResponseDto.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userFullName(review.getUser().getFullName())
                .productId(review.getProduct().getId())
                .rating(review.getRating())
                .comment(null)
                .createdAt(review.getCreatedAt())
                .build();
    }
}
