package com.backend.features.review.service;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.features.review.dto.CreateReviewReplyRequestDto;
import com.backend.features.review.dto.CreateReviewRequestDto;
import com.backend.features.review.dto.GetReviewResponseDto;
import com.backend.features.review.Review;
import com.backend.features.user.User;
import com.backend.features.review.enums.ReviewStatus;
import com.backend.common.enums.UserRole;
import com.backend.features.order.repository.OrderRepository;
import com.backend.features.product.repository.ProductRepository;
import com.backend.features.review.repository.ReviewRepository;
import com.backend.features.user.repository.UserRepository;
import com.backend.features.auth.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService {

    public static final int MAX_REVIEWS_PER_USER_PER_PRODUCT = 3;

    private static final String PRODUCT_NOT_FOUND = "Product not found";
    private static final String REVIEW_NOT_FOUND = "Review not found";
    private static final String REVIEW_NOT_ALLOWED = "You can only review products from delivered orders";
    private static final String REVIEW_LIMIT_REACHED = "You can review this product at most 3 times";

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public Page<GetReviewResponseDto> getProductReviews(UUID productId, Pageable pageable) {
        assertProductExists(productId);
        return reviewRepository
                .findByProductIdAndStatusOrderByCreatedAtDesc(productId, ReviewStatus.VISIBLE, pageable)
                .map(this::toDto);
    }

    @Transactional
    public GetReviewResponseDto createReview(UUID productId, CreateReviewRequestDto request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
        assertProductExists(productId);

        if (!orderRepository.hasDeliveredOrderWithProduct(userId, productId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, REVIEW_NOT_ALLOWED);
        }
        if (reviewRepository.countByUserIdAndProductId(userId, productId) >= MAX_REVIEWS_PER_USER_PER_PRODUCT) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, REVIEW_LIMIT_REACHED);
        }

        Review review = Review.builder()
                .user(user)
                .product(productRepository.getReferenceById(productId))
                .rating(request.getRating())
                .comment(normalizeComment(request.getComment()))
                .status(ReviewStatus.VISIBLE)
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

    @Transactional
    public GetReviewResponseDto replyToReviewAdmin(UUID reviewId, CreateReviewReplyRequestDto request) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        UUID adminId = SecurityUtils.getCurrentUserId();
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, REVIEW_NOT_FOUND));

        review.setReplyComment(normalizeComment(request.getComment()));
        review.setReplyUser(admin);
        review.setReplyCreatedAt(OffsetDateTime.now());
        return toDto(reviewRepository.save(review));
    }

    @Transactional(readOnly = true)
    public Page<GetReviewResponseDto> getAllReviewsAdmin(UUID productId, Pageable pageable) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        Page<Review> reviews = productId != null
                ? reviewRepository.findByProductIdOrderByCreatedAtDesc(productId, pageable)
                : reviewRepository.findAllByOrderByCreatedAtDesc(pageable);
        return reviews.map(this::toDto);
    }

    @Transactional
    public GetReviewResponseDto hideReviewAdmin(UUID reviewId) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, REVIEW_NOT_FOUND));
        review.setStatus(ReviewStatus.HIDDEN);
        return toDto(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReviewAdmin(UUID reviewId) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, REVIEW_NOT_FOUND));
        reviewRepository.delete(review);
    }

    private void assertProductExists(UUID productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, PRODUCT_NOT_FOUND);
        }
    }

    private String normalizeComment(String comment) {
        if (comment == null || comment.isBlank()) {
            return null;
        }
        return comment.trim();
    }

    private GetReviewResponseDto toDto(Review review) {
        User replyUser = review.getReplyUser();
        return GetReviewResponseDto.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userFullName(review.getUser().getFullName())
                .productId(review.getProduct().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .status(review.getStatus())
                .createdAt(review.getCreatedAt())
                .replyComment(review.getReplyComment())
                .replyUserFullName(replyUser != null ? replyUser.getFullName() : null)
                .replyCreatedAt(review.getReplyCreatedAt())
                .build();
    }
}
