package com.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.common.enums.UserRole;
import com.backend.features.auth.security.JwtUserPrincipal;
import com.backend.features.cart.dto.AddCartItemRequestDto;
import com.backend.features.cart.dto.GetCartResponseDto;
import com.backend.features.cart.dto.UpdateCartItemRequestDto;
import com.backend.features.cart.repository.CartItemRepository;
import com.backend.features.cart.service.CartService;
import com.backend.features.product.Product;
import com.backend.features.product.enums.ProductStatus;
import com.backend.features.product.repository.ProductRepository;
import com.backend.features.user.User;
import com.backend.features.user.repository.UserRepository;
import com.backend.support.IntegrationTestAuth;

@SpringBootTest
@Transactional
class CartIntegrationTest {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    private CartTestContext prepareTestContext() {
        OffsetDateTime now = OffsetDateTime.now();
        User testUser = userRepository.save(User.builder()
                .email("cart-integration-" + UUID.randomUUID() + "@test.local")
                .fullName("Cart Integration User")
                .phone("0900000001")
                .role(UserRole.CUSTOMER)
                .isActive(true)
                .emailVerifiedAt(now)
                .createdAt(now)
                .updatedAt(now)
                .build());

        JwtUserPrincipal principal = new JwtUserPrincipal(testUser.getId(), testUser.getEmail(), UserRole.CUSTOMER);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, List.of()));

        Product activeProduct = productRepository.findAll().stream()
                .filter(product -> product.getStatus() == ProductStatus.ACTIVE)
                .filter(product -> product.getStock() != null && product.getStock() >= 5)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No active product with stock >= 5 in database"));

        return new CartTestContext(testUser, activeProduct);
    }

    private record CartTestContext(User testUser, Product activeProduct) {
    }

    @Test
    void fullCartFlow_getAddIncrementUpdateRemove() {
        CartTestContext context = prepareTestContext();
        try {
            GetCartResponseDto emptyCart = cartService.getMyCart();
            assertThat(emptyCart.getItems()).isEmpty();
            assertThat(emptyCart.getItemCount()).isZero();

            AddCartItemRequestDto addRequest = new AddCartItemRequestDto();
            addRequest.setProductId(context.activeProduct().getId());
            addRequest.setQuantity(2);

            GetCartResponseDto afterAdd = cartService.addItem(addRequest);
            assertThat(afterAdd.getItems()).hasSize(1);
            assertThat(afterAdd.getItemCount()).isEqualTo(2);
            assertThat(afterAdd.getItems().getFirst().getProductId()).isEqualTo(context.activeProduct().getId());
            assertThat(afterAdd.getTotalAmount()).isGreaterThan(BigDecimal.ZERO);

            UUID cartItemId = afterAdd.getItems().getFirst().getId();

            GetCartResponseDto afterIncrement = cartService.addItem(addRequest);
            assertThat(afterIncrement.getItems()).hasSize(1);
            assertThat(afterIncrement.getItemCount()).isEqualTo(4);
            assertThat(afterIncrement.getItems().getFirst().getQuantity()).isEqualTo(4);

            UpdateCartItemRequestDto updateRequest = new UpdateCartItemRequestDto();
            updateRequest.setQuantity(1);
            GetCartResponseDto afterUpdate = cartService.updateItem(cartItemId, updateRequest);
            assertThat(afterUpdate.getItemCount()).isEqualTo(1);

            GetCartResponseDto afterRemove = cartService.removeItem(cartItemId);
            assertThat(afterRemove.getItems()).isEmpty();
            assertThat(afterRemove.getItemCount()).isZero();
        } finally {
            IntegrationTestAuth.clearSecurityContext();
        }
    }

    @Test
    void addItem_rejectsInsufficientStock() {
        CartTestContext context = prepareTestContext();
        try {
            AddCartItemRequestDto request = new AddCartItemRequestDto();
            request.setProductId(context.activeProduct().getId());
            request.setQuantity(context.activeProduct().getStock() + 1);

            assertThatThrownBy(() -> cartService.addItem(request))
                    .isInstanceOf(ResponseStatusException.class)
                    .extracting(ex -> ((ResponseStatusException) ex).getStatusCode())
                    .isEqualTo(HttpStatus.BAD_REQUEST);
        } finally {
            IntegrationTestAuth.clearSecurityContext();
        }
    }

    @Test
    void clearCart_removesAllItems() {
        CartTestContext context = prepareTestContext();
        try {
            AddCartItemRequestDto request = new AddCartItemRequestDto();
            request.setProductId(context.activeProduct().getId());
            request.setQuantity(1);
            GetCartResponseDto cart = cartService.addItem(request);

            cartService.clearCart(cart.getId());

            assertThat(cartItemRepository.findByCartId(cart.getId())).isEmpty();
        } finally {
            IntegrationTestAuth.clearSecurityContext();
        }
    }
}
