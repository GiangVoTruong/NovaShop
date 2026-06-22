package com.backend.integration;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assumptions.assumeTrue;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.common.enums.UserRole;
import com.backend.features.order.dto.GetOrderItemResponseDto;
import com.backend.features.order.dto.GetOrderResponseDto;
import com.backend.features.order.enums.OrderStatus;
import com.backend.features.order.service.OrderService;
import com.backend.features.review.dto.CreateReviewReplyRequestDto;
import com.backend.features.review.dto.CreateReviewRequestDto;
import com.backend.features.review.dto.GetReviewResponseDto;
import com.backend.features.review.repository.ReviewRepository;
import com.backend.features.review.service.ReviewService;
import com.backend.features.user.User;
import com.backend.features.user.repository.UserRepository;
import com.backend.support.IntegrationTestAuth;

@SpringBootTest
@Transactional
class ReviewIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ReviewService reviewService;

    private User testUser;

    @Test
    void createUpToThreeReviews_andAdminReply() {
        String email = IntegrationTestAuth.resolveTestUserEmail();
        assumeTrue(email != null && !email.isBlank(), "Set TEST_USER_EMAIL to run review integration test");

        testUser = IntegrationTestAuth.requireUser(userRepository, email);
        IntegrationTestAuth.setSecurityContext(testUser);

        UUID productId = findReviewableProductId();
        assumeTrue(productId != null, "No delivered order product available for review test");

        cleanupUserReviews(productId);

        List<UUID> createdIds = new ArrayList<>();
        for (int index = 1; index <= ReviewService.MAX_REVIEWS_PER_USER_PER_PRODUCT; index++) {
            CreateReviewRequestDto request = new CreateReviewRequestDto();
            request.setRating((short) 5);
            request.setComment("Integration review " + index);
            GetReviewResponseDto created = reviewService.createReview(productId, request);
            createdIds.add(created.getId());
        }

        CreateReviewRequestDto fourth = new CreateReviewRequestDto();
        fourth.setRating((short) 4);
        fourth.setComment("Should fail");
        assertThatThrownBy(() -> reviewService.createReview(productId, fourth))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(ex -> ((ResponseStatusException) ex).getStatusCode())
                .isEqualTo(HttpStatus.CONFLICT);

        User admin = testUser.getRole() == UserRole.ADMIN
                ? testUser
                : userRepository.findAll().stream()
                        .filter(user -> user.getRole() == UserRole.ADMIN)
                        .findFirst()
                        .orElse(null);
        assumeTrue(admin != null, "No admin user available for reply test");

        IntegrationTestAuth.setSecurityContext(admin);
        CreateReviewReplyRequestDto replyRequest = new CreateReviewReplyRequestDto();
        replyRequest.setComment("Cảm ơn bạn đã mua hàng!");
        GetReviewResponseDto replied = reviewService.replyToReviewAdmin(createdIds.getFirst(), replyRequest);
        assertThat(replied.getReplyComment()).isEqualTo("Cảm ơn bạn đã mua hàng!");
        assertThat(replied.getReplyUserFullName()).isNotBlank();

        IntegrationTestAuth.setSecurityContext(testUser);
        createdIds.forEach(reviewService::deleteReview);
        assertThat(reviewRepository.countByUserIdAndProductId(testUser.getId(), productId)).isZero();
        IntegrationTestAuth.clearSecurityContext();
    }

    private void cleanupUserReviews(UUID productId) {
        reviewRepository.findByProductIdOrderByCreatedAtDesc(
                productId, org.springframework.data.domain.PageRequest.of(0, 100))
                .getContent()
                .stream()
                .filter(review -> review.getUser().getId().equals(testUser.getId()))
                .forEach(reviewRepository::delete);
    }

    private UUID findReviewableProductId() {
        List<GetOrderResponseDto> orders = orderService.getMyOrders();
        for (GetOrderResponseDto order : orders) {
            if (order.getStatus() != OrderStatus.DELIVERED
                    && order.getStatus() != OrderStatus.DELIVERED_PENDING_RECEIVER_CONFIRM) {
                continue;
            }
            for (GetOrderItemResponseDto item : order.getItems()) {
                if (item.getProductId() != null) {
                    return item.getProductId();
                }
            }
        }
        return null;
    }
}
