package com.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import com.backend.features.review.dto.CreateReviewReplyRequestDto;
import com.backend.features.review.dto.CreateReviewRequestDto;
import com.backend.features.review.dto.GetReviewResponseDto;
import com.backend.features.product.Product;
import com.backend.features.review.Review;
import com.backend.features.user.User;
import com.backend.features.review.enums.ReviewStatus;
import com.backend.common.enums.UserRole;
import com.backend.features.order.repository.OrderRepository;
import com.backend.features.product.repository.ProductRepository;
import com.backend.features.review.repository.ReviewRepository;
import com.backend.features.user.repository.UserRepository;
import com.backend.features.auth.security.JwtUserPrincipal;
import com.backend.features.review.service.ReviewService;
@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    private static final UUID USER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID ADMIN_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID PRODUCT_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");
    private static final UUID REVIEW_ID = UUID.fromString("55555555-5555-5555-5555-555555555555");

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private ReviewService reviewService;

    private User user;
    private User admin;
    private Product product;

    @BeforeEach
    void setUp() {
        JwtUserPrincipal principal = new JwtUserPrincipal(USER_ID, "customer@example.com", UserRole.CUSTOMER);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, List.of()));

        user = User.builder().id(USER_ID).fullName("Test User").build();
        admin = User.builder().id(ADMIN_ID).fullName("Shop Admin").role(UserRole.ADMIN).build();
        product = Product.builder().id(PRODUCT_ID).build();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void createReview_savesRatingAndComment() {
        CreateReviewRequestDto request = new CreateReviewRequestDto();
        request.setRating((short) 5);
        request.setComment("  Great product!  ");

        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(productRepository.existsById(PRODUCT_ID)).thenReturn(true);
        when(reviewRepository.countByUserIdAndProductId(USER_ID, PRODUCT_ID)).thenReturn(0L);
        when(orderRepository.hasDeliveredOrderWithProduct(USER_ID, PRODUCT_ID)).thenReturn(true);
        when(productRepository.getReferenceById(PRODUCT_ID)).thenReturn(product);
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> {
            Review savedReview = invocation.getArgument(0);
            savedReview.setId(REVIEW_ID);
            savedReview.setUser(user);
            savedReview.setProduct(product);
            return savedReview;
        });

        GetReviewResponseDto response = reviewService.createReview(PRODUCT_ID, request);

        ArgumentCaptor<Review> captor = ArgumentCaptor.forClass(Review.class);
        verify(reviewRepository).save(captor.capture());
        assertThat(captor.getValue().getComment()).isEqualTo("Great product!");
        assertThat(response.getRating()).isEqualTo((short) 5);
        assertThat(response.getComment()).isEqualTo("Great product!");
    }

    @Test
    void createReview_rejectsWhenLimitReached() {
        CreateReviewRequestDto request = new CreateReviewRequestDto();
        request.setRating((short) 4);

        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(productRepository.existsById(PRODUCT_ID)).thenReturn(true);
        when(orderRepository.hasDeliveredOrderWithProduct(USER_ID, PRODUCT_ID)).thenReturn(true);
        when(reviewRepository.countByUserIdAndProductId(USER_ID, PRODUCT_ID)).thenReturn(3L);

        assertThatThrownBy(() -> reviewService.createReview(PRODUCT_ID, request))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(ex -> ((ResponseStatusException) ex).getStatusCode())
                .isEqualTo(HttpStatus.CONFLICT);

        verify(reviewRepository, never()).save(any());
    }

    @Test
    void createReview_rejectsWhenNoDeliveredOrder() {
        CreateReviewRequestDto request = new CreateReviewRequestDto();
        request.setRating((short) 4);

        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(productRepository.existsById(PRODUCT_ID)).thenReturn(true);
        when(orderRepository.hasDeliveredOrderWithProduct(USER_ID, PRODUCT_ID)).thenReturn(false);

        assertThatThrownBy(() -> reviewService.createReview(PRODUCT_ID, request))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(ex -> ((ResponseStatusException) ex).getReason())
                .isEqualTo("You can only review products from delivered orders");
    }

    @Test
    void replyToReviewAdmin_savesReply() {
        JwtUserPrincipal adminPrincipal = new JwtUserPrincipal(ADMIN_ID, "admin@example.com", UserRole.ADMIN);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(adminPrincipal, null, List.of()));

        Review review = Review.builder()
                .id(REVIEW_ID)
                .user(user)
                .product(product)
                .rating((short) 5)
                .comment("Nice")
                .build();

        CreateReviewReplyRequestDto request = new CreateReviewReplyRequestDto();
        request.setComment("Thank you for your feedback!");

        when(userRepository.findById(ADMIN_ID)).thenReturn(Optional.of(admin));
        when(reviewRepository.findById(REVIEW_ID)).thenReturn(Optional.of(review));
        when(reviewRepository.save(review)).thenAnswer(invocation -> {
            Review saved = invocation.getArgument(0);
            saved.setReplyUser(admin);
            return saved;
        });

        GetReviewResponseDto response = reviewService.replyToReviewAdmin(REVIEW_ID, request);

        assertThat(review.getReplyComment()).isEqualTo("Thank you for your feedback!");
        assertThat(response.getReplyComment()).isEqualTo("Thank you for your feedback!");
        assertThat(response.getReplyUserFullName()).isEqualTo("Shop Admin");
    }

    @Test
    void deleteReview_removesOwnReview() {
        Review review = Review.builder()
                .id(REVIEW_ID)
                .user(user)
                .product(product)
                .rating((short) 5)
                .build();

        when(reviewRepository.findByIdAndUserId(REVIEW_ID, USER_ID)).thenReturn(Optional.of(review));

        reviewService.deleteReview(REVIEW_ID);

        verify(reviewRepository).delete(review);
    }

    @Test
    void deleteReview_throwsWhenNotFound() {
        when(reviewRepository.findByIdAndUserId(REVIEW_ID, USER_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reviewService.deleteReview(REVIEW_ID))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(ex -> ((ResponseStatusException) ex).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getProductReviews_returnsVisibleReviewsWithReply() {
        Review review = Review.builder()
                .id(REVIEW_ID)
                .user(user)
                .product(product)
                .rating((short) 5)
                .comment("Nice")
                .status(ReviewStatus.VISIBLE)
                .createdAt(OffsetDateTime.now())
                .replyComment("Thanks!")
                .replyUser(admin)
                .replyCreatedAt(OffsetDateTime.now())
                .build();

        when(productRepository.existsById(PRODUCT_ID)).thenReturn(true);
        when(reviewRepository.findByProductIdAndStatusOrderByCreatedAtDesc(
                PRODUCT_ID, ReviewStatus.VISIBLE, PageRequest.of(0, 10)))
                .thenReturn(new PageImpl<>(List.of(review)));

        Page<GetReviewResponseDto> page = reviewService.getProductReviews(PRODUCT_ID, PageRequest.of(0, 10));

        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().getFirst().getComment()).isEqualTo("Nice");
        assertThat(page.getContent().getFirst().getReplyComment()).isEqualTo("Thanks!");
    }
}
