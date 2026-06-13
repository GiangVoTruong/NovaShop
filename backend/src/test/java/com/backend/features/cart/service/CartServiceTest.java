package com.backend.features.cart.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
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
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import com.backend.common.util.ProductPriceUtils;
import com.backend.features.cart.dto.AddCartItemRequestDto;
import com.backend.features.cart.dto.GetCartResponseDto;
import com.backend.features.cart.dto.UpdateCartItemRequestDto;
import com.backend.features.cart.Cart;
import com.backend.features.cart.CartItem;
import com.backend.features.product.Product;
import com.backend.features.product.ProductImage;
import com.backend.features.user.User;
import com.backend.features.product.enums.ProductStatus;
import com.backend.common.enums.UserRole;
import com.backend.features.cart.repository.CartItemRepository;
import com.backend.features.cart.repository.CartRepository;
import com.backend.features.product.repository.ProductImageRepository;
import com.backend.features.product.repository.ProductRepository;
import com.backend.features.user.repository.UserRepository;
import com.backend.features.auth.security.JwtUserPrincipal;
import com.backend.features.cart.service.CartService;
@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    private static final UUID USER_ID = UUID.fromString("11111111-1111-1111-1111-111111111111");
    private static final UUID CART_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID PRODUCT_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");
    private static final UUID CART_ITEM_ID = UUID.fromString("44444444-4444-4444-4444-444444444444");

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductImageRepository productImageRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Cart cart;
    private Product product;

    @BeforeEach
    void setUpSecurityContext() {
        JwtUserPrincipal principal = new JwtUserPrincipal(USER_ID, "customer@example.com", UserRole.CUSTOMER);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(principal, null, List.of()));

        user = User.builder().id(USER_ID).email("customer@example.com").build();
        cart = Cart.builder().id(CART_ID).user(user).build();
        product = Product.builder()
                .id(PRODUCT_ID)
                .name("Test Product")
                .slug("test-product")
                .price(new BigDecimal("100000"))
                .discountPrice(new BigDecimal("80000"))
                .stock(10)
                .status(ProductStatus.ACTIVE)
                .build();
    }

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void getMyCart_createsCartWhenMissing() {
        when(cartRepository.findByUserId(USER_ID)).thenReturn(Optional.empty());
        when(userRepository.findById(USER_ID)).thenReturn(Optional.of(user));
        when(cartRepository.save(any(Cart.class))).thenAnswer(invocation -> {
            Cart savedCart = invocation.getArgument(0);
            savedCart.setId(CART_ID);
            return savedCart;
        });
        when(cartItemRepository.findDetailedByCartId(CART_ID)).thenReturn(List.of());

        GetCartResponseDto response = cartService.getMyCart();

        assertThat(response.getId()).isEqualTo(CART_ID);
        assertThat(response.getItems()).isEmpty();
        assertThat(response.getItemCount()).isZero();
        assertThat(response.getTotalAmount()).isEqualByComparingTo(BigDecimal.ZERO);
        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    void getMyCart_returnsExistingCartWithItems() {
        CartItem cartItem = buildCartItem(CART_ITEM_ID, 2);
        when(cartRepository.findByUserId(USER_ID)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findDetailedByCartId(CART_ID)).thenReturn(List.of(cartItem));
        when(productImageRepository.findByProductIdAndIsPrimaryTrue(PRODUCT_ID))
                .thenReturn(Optional.of(ProductImage.builder().url("https://cdn.example/img.jpg").build()));

        GetCartResponseDto response = cartService.getMyCart();

        assertThat(response.getItems()).hasSize(1);
        assertThat(response.getItems().getFirst().getProductName()).isEqualTo("Test Product");
        assertThat(response.getItems().getFirst().getUnitPrice()).isEqualByComparingTo("80000");
        assertThat(response.getItems().getFirst().getSubtotal()).isEqualByComparingTo("160000");
        assertThat(response.getItems().getFirst().getImageUrl()).isEqualTo("https://cdn.example/img.jpg");
        assertThat(response.getItemCount()).isEqualTo(2);
        assertThat(response.getTotalAmount()).isEqualByComparingTo("160000");
    }

    @Test
    void addItem_createsNewCartItem() {
        AddCartItemRequestDto request = new AddCartItemRequestDto();
        request.setProductId(PRODUCT_ID);
        request.setQuantity(3);

        when(cartRepository.findByUserId(USER_ID)).thenReturn(Optional.of(cart));
        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByCartIdAndProductId(CART_ID, PRODUCT_ID)).thenReturn(Optional.empty());
        when(cartItemRepository.save(any(CartItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(cartItemRepository.findDetailedByCartId(CART_ID)).thenReturn(
                List.of(buildCartItem(CART_ITEM_ID, 3)));

        GetCartResponseDto response = cartService.addItem(request);

        ArgumentCaptor<CartItem> captor = ArgumentCaptor.forClass(CartItem.class);
        verify(cartItemRepository).save(captor.capture());
        assertThat(captor.getValue().getQuantity()).isEqualTo(3);
        assertThat(captor.getValue().getCart()).isEqualTo(cart);
        assertThat(captor.getValue().getProduct()).isEqualTo(product);
        assertThat(response.getItemCount()).isEqualTo(3);
    }

    @Test
    void addItem_incrementsExistingCartItem() {
        AddCartItemRequestDto request = new AddCartItemRequestDto();
        request.setProductId(PRODUCT_ID);
        request.setQuantity(2);

        CartItem existingItem = buildCartItem(CART_ITEM_ID, 3);

        when(cartRepository.findByUserId(USER_ID)).thenReturn(Optional.of(cart));
        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByCartIdAndProductId(CART_ID, PRODUCT_ID)).thenReturn(Optional.of(existingItem));
        when(cartItemRepository.save(existingItem)).thenReturn(existingItem);
        when(cartItemRepository.findDetailedByCartId(CART_ID)).thenReturn(
                List.of(buildCartItem(CART_ITEM_ID, 5)));

        cartService.addItem(request);

        assertThat(existingItem.getQuantity()).isEqualTo(5);
        verify(cartItemRepository).save(existingItem);
    }

    @Test
    void addItem_throwsWhenProductNotAvailable() {
        AddCartItemRequestDto request = new AddCartItemRequestDto();
        request.setProductId(PRODUCT_ID);
        request.setQuantity(1);

        Product inactiveProduct = Product.builder()
                .id(PRODUCT_ID)
                .status(ProductStatus.INACTIVE)
                .build();

        when(cartRepository.findByUserId(USER_ID)).thenReturn(Optional.of(cart));
        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.of(inactiveProduct));

        assertThatThrownBy(() -> cartService.addItem(request))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(ex -> ((ResponseStatusException) ex).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);

        verify(cartItemRepository, never()).save(any());
    }

    @Test
    void addItem_throwsWhenInsufficientStock() {
        AddCartItemRequestDto request = new AddCartItemRequestDto();
        request.setProductId(PRODUCT_ID);
        request.setQuantity(11);

        when(cartRepository.findByUserId(USER_ID)).thenReturn(Optional.of(cart));
        when(productRepository.findById(PRODUCT_ID)).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> cartService.addItem(request))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(ex -> ((ResponseStatusException) ex).getReason())
                .isEqualTo("Insufficient stock");
    }

    @Test
    void updateItem_updatesQuantity() {
        UpdateCartItemRequestDto request = new UpdateCartItemRequestDto();
        request.setQuantity(4);

        CartItem cartItem = buildCartItem(CART_ITEM_ID, 2);

        when(cartRepository.findByUserId(USER_ID)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findById(CART_ITEM_ID)).thenReturn(Optional.of(cartItem));
        when(cartItemRepository.save(cartItem)).thenReturn(cartItem);
        when(cartItemRepository.findDetailedByCartId(CART_ID)).thenReturn(
                List.of(buildCartItem(CART_ITEM_ID, 4)));

        GetCartResponseDto response = cartService.updateItem(CART_ITEM_ID, request);

        assertThat(cartItem.getQuantity()).isEqualTo(4);
        assertThat(response.getItemCount()).isEqualTo(4);
    }

    @Test
    void updateItem_throwsWhenCartItemNotFound() {
        UpdateCartItemRequestDto request = new UpdateCartItemRequestDto();
        request.setQuantity(1);

        when(cartRepository.findByUserId(USER_ID)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findById(CART_ITEM_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.updateItem(CART_ITEM_ID, request))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(ex -> ((ResponseStatusException) ex).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void updateItem_throwsWhenCartItemBelongsToAnotherCart() {
        UpdateCartItemRequestDto request = new UpdateCartItemRequestDto();
        request.setQuantity(1);

        Cart otherCart = Cart.builder().id(UUID.randomUUID()).user(user).build();
        CartItem cartItem = CartItem.builder()
                .id(CART_ITEM_ID)
                .cart(otherCart)
                .product(product)
                .quantity(1)
                .build();

        when(cartRepository.findByUserId(USER_ID)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findById(CART_ITEM_ID)).thenReturn(Optional.of(cartItem));

        assertThatThrownBy(() -> cartService.updateItem(CART_ITEM_ID, request))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(ex -> ((ResponseStatusException) ex).getStatusCode())
                .isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void removeItem_deletesCartItem() {
        CartItem cartItem = buildCartItem(CART_ITEM_ID, 2);

        when(cartRepository.findByUserId(USER_ID)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findById(CART_ITEM_ID)).thenReturn(Optional.of(cartItem));
        when(cartItemRepository.findDetailedByCartId(CART_ID)).thenReturn(List.of());

        GetCartResponseDto response = cartService.removeItem(CART_ITEM_ID);

        verify(cartItemRepository).delete(cartItem);
        assertThat(response.getItems()).isEmpty();
    }

    @Test
    void clearCart_deletesAllItems() {
        cartService.clearCart(CART_ID);

        verify(cartItemRepository).deleteByCartId(CART_ID);
    }

    @Test
    void resolveUnitPrice_prefersDiscountPrice() {
        assertThat(ProductPriceUtils.resolveUnitPrice(product)).isEqualByComparingTo("80000");
    }

    @Test
    void resolveUnitPrice_fallsBackToRegularPrice() {
        product.setDiscountPrice(null);

        assertThat(ProductPriceUtils.resolveUnitPrice(product)).isEqualByComparingTo("100000");
    }

    private CartItem buildCartItem(UUID itemId, int quantity) {
        return CartItem.builder()
                .id(itemId)
                .cart(cart)
                .product(product)
                .quantity(quantity)
                .build();
    }
}
