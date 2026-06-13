package com.backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.features.cart.dto.AddCartItemRequestDto;
import com.backend.features.cart.dto.GetCartResponseDto;
import com.backend.features.cart.dto.UpdateCartItemRequestDto;
import com.backend.features.product.Product;
import com.backend.features.user.User;
import com.backend.features.product.enums.ProductStatus;
import com.backend.common.enums.UserRole;
import com.backend.features.cart.repository.CartItemRepository;
import com.backend.features.cart.repository.CartRepository;
import com.backend.features.product.repository.ProductRepository;
import com.backend.features.user.repository.UserRepository;
import com.backend.features.auth.security.JwtUserPrincipal;
import com.backend.features.cart.Cart;
import com.backend.features.cart.service.CartService;
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
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    private User testUser;
    private Product activeProduct;

    @BeforeEach
    void setUp() {
        OffsetDateTime now = OffsetDateTime.now();
        testUser = userRepository.save(User.builder()
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

        activeProduct = productRepository.findAll().stream()
                .filter(product -> product.getStatus() == ProductStatus.ACTIVE)
                .filter(product -> product.getStock() != null && product.getStock() >= 5)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No active product with stock >= 5 in database"));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void fullCartFlow_getAddIncrementUpdateRemove() {
        GetCartResponseDto emptyCart = cartService.getMyCart();
        assertThat(emptyCart.getItems()).isEmpty();
        assertThat(emptyCart.getItemCount()).isZero();

        AddCartItemRequestDto addRequest = new AddCartItemRequestDto();
        addRequest.setProductId(activeProduct.getId());
        addRequest.setQuantity(2);

        GetCartResponseDto afterAdd = cartService.addItem(addRequest);
        assertThat(afterAdd.getItems()).hasSize(1);
        assertThat(afterAdd.getItemCount()).isEqualTo(2);
        assertThat(afterAdd.getItems().getFirst().getProductId()).isEqualTo(activeProduct.getId());
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
    }

    @Test
    void addItem_rejectsInsufficientStock() {
        AddCartItemRequestDto request = new AddCartItemRequestDto();
        request.setProductId(activeProduct.getId());
        request.setQuantity(activeProduct.getStock() + 1);

        assertThatThrownBy(() -> cartService.addItem(request))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(ex -> ((ResponseStatusException) ex).getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void clearCart_removesAllItems() {
        AddCartItemRequestDto request = new AddCartItemRequestDto();
        request.setProductId(activeProduct.getId());
        request.setQuantity(1);
        GetCartResponseDto cart = cartService.addItem(request);

        cartService.clearCart(cart.getId());

        assertThat(cartItemRepository.findByCartId(cart.getId())).isEmpty();
    }
}
