package com.backend.integration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import com.backend.features.analytics.service.AnalyticsService;
import com.backend.features.cart.dto.AddCartItemRequestDto;
import com.backend.features.cart.service.CartService;
import com.backend.features.coupon.dto.ValidateCouponResponseDto;
import com.backend.features.coupon.service.CouponService;
import com.backend.features.notification.service.NotificationPreferenceService;
import com.backend.features.notification.service.NotificationService;
import com.backend.features.order.dto.CreateOrderRequestDto;
import com.backend.features.order.dto.GetOrderResponseDto;
import com.backend.features.order.service.OrderService;
import com.backend.features.payment.enums.PaymentMethodType;
import com.backend.features.product.Product;
import com.backend.features.product.enums.ProductStatus;
import com.backend.features.product.repository.ProductRepository;
import com.backend.features.product.service.ProductService;
import com.backend.features.settings.service.ShopSettingsService;
import com.backend.features.user.User;
import com.backend.features.user.dto.GetAddressResponseDto;
import com.backend.features.user.dto.GetUserReponseDto;
import com.backend.features.user.repository.UserRepository;
import com.backend.features.user.service.AddressService;
import com.backend.features.user.service.UserService;
import com.backend.features.wishlist.dto.GetWishlistResponseDto;
import com.backend.features.wishlist.service.WishlistService;
import com.backend.support.IntegrationTestAuth;

@SpringBootTest
@Transactional
class NovaShopFullFlowIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ShopSettingsService shopSettingsService;

    @Autowired
    private CartService cartService;

    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private CouponService couponService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private AddressService addressService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationPreferenceService notificationPreferenceService;

    @Autowired
    private AnalyticsService analyticsService;

    private FullFlowTestContext prepareTestContext() {
        String email = IntegrationTestAuth.resolveTestUserEmail();
        assumeTrue(email != null && !email.isBlank(), "Set TEST_USER_EMAIL to run full flow integration test");

        User testUser = IntegrationTestAuth.requireUser(userRepository, email);
        IntegrationTestAuth.setSecurityContext(testUser);

        Product activeProduct = productRepository.findAll().stream()
                .filter(product -> product.getStatus() == ProductStatus.ACTIVE)
                .filter(product -> product.getStock() != null && product.getStock() >= 2)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No active product with stock"));

        return new FullFlowTestContext(testUser, activeProduct);
    }

    private record FullFlowTestContext(User testUser, Product activeProduct) {

    }

    @Test
    void publicCatalogFlow() {
        FullFlowTestContext context = prepareTestContext();
        try {
            assertThat(shopSettingsService.getPublicSettings()).isNotNull();
            assertThat(productService.getAllCategories()).isNotEmpty();
            assertThat(productService.listProducts(null, null, null, null, PageRequest.of(0, 5)).getContent())
                    .isNotEmpty();
            assertThat(productService.getProductById(context.activeProduct().getId())).isNotNull();
            assertThat(productService.getProductBySlug(context.activeProduct().getSlug())).isNotNull();
        } finally {
            IntegrationTestAuth.clearSecurityContext();
        }
    }

    @Test
    void customerProfileAndNotificationsFlow() {
        FullFlowTestContext context = prepareTestContext();
        try {
            GetUserReponseDto profile = userService.getCurrentUser();
            assertThat(profile.getEmail()).isEqualToIgnoringCase(context.testUser().getEmail());

            assertThat(notificationPreferenceService.getMyPreferences()).isNotNull();
            assertThat(notificationService.getUnreadCountByUserId(context.testUser().getId())).isNotNull();
            assertThat(notificationService.getNotificationsByUserId(context.testUser().getId(), PageRequest.of(0, 5))
                    .getContent()).isNotNull();
        } finally {
            IntegrationTestAuth.clearSecurityContext();
        }
    }

    @Test
    void cartAndWishlistFlow() {
        FullFlowTestContext context = prepareTestContext();
        try {
            AddCartItemRequestDto addRequest = new AddCartItemRequestDto();
            addRequest.setProductId(context.activeProduct().getId());
            addRequest.setQuantity(1);
            assertThat(cartService.addItem(addRequest).getItemCount()).isEqualTo(1);

            wishlistService.addItem(context.activeProduct().getId());
            assertThat(wishlistService.checkProduct(context.activeProduct().getId()).isInWishlist()).isTrue();

            GetWishlistResponseDto wishlist = wishlistService.getMyWishlist();
            assertThat(wishlist.getItems()).isNotEmpty();

            wishlistService.removeItem(context.activeProduct().getId());
            assertThat(wishlistService.checkProduct(context.activeProduct().getId()).isInWishlist()).isFalse();
        } finally {
            IntegrationTestAuth.clearSecurityContext();
        }
    }

    @Test
    void couponAndOrdersFlow() {
        try {
            ValidateCouponResponseDto couponResult = couponService.validate("INVALID_CODE", BigDecimal.valueOf(100_000));
            assertThat(couponResult.isValid()).isFalse();

            List<GetOrderResponseDto> orders = orderService.getMyOrders();
            assertThat(orders).isNotNull();
        } finally {
            IntegrationTestAuth.clearSecurityContext();
        }
    }

    @Test
    void checkoutFlowWhenAddressExists() {
        FullFlowTestContext context = prepareTestContext();
        try {
            List<GetAddressResponseDto> addresses = addressService.getMyAddresses();
            if (addresses.isEmpty()) {
                return;
            }

            AddCartItemRequestDto addRequest = new AddCartItemRequestDto();
            addRequest.setProductId(context.activeProduct().getId());
            addRequest.setQuantity(1);
            cartService.addItem(addRequest);

            CreateOrderRequestDto checkoutRequest = new CreateOrderRequestDto();
            checkoutRequest.setPaymentMethod(PaymentMethodType.COD);
            checkoutRequest.setAddressId(addresses.getFirst().getId());
            checkoutRequest.setNote("Integration test order");

            GetOrderResponseDto order = orderService.checkout(checkoutRequest);
            assertThat(order.getId()).isNotNull();
            assertThat(orderService.getOrderById(order.getId()).getId()).isEqualTo(order.getId());
        } finally {
            IntegrationTestAuth.clearSecurityContext();
        }
    }

    @Test
    void adminFlowWhenUserIsAdmin() {
        FullFlowTestContext context = prepareTestContext();
        try {
            assumeTrue(IntegrationTestAuth.isAdmin(context.testUser()), "Admin-only flow skipped for non-admin user");

            assertThat(userService.getAllUsers()).isNotEmpty();
            assertThat(analyticsService.getOverview(null, null)).isNotNull();
            assertThat(analyticsService.getSummary()).isNotNull();
        } finally {
            IntegrationTestAuth.clearSecurityContext();
        }
    }
}
