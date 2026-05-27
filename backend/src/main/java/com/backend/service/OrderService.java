package com.backend.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.dto.orders.CreateOrderRequestDto;
import com.backend.dto.orders.GetOrderItemResponseDto;
import com.backend.dto.orders.GetOrderResponseDto;
import com.backend.dto.orders.UpdateOrderStatusRequestDto;
import com.backend.entity.Cart;
import com.backend.entity.CartItem;
import com.backend.entity.Notification;
import com.backend.entity.OrderItem;
import com.backend.entity.Product;
import com.backend.entity.ShopOrder;
import com.backend.entity.User;
import com.backend.enums.OrderStatus;
import com.backend.enums.PaymentStatusType;
import com.backend.enums.ProductStatus;
import com.backend.enums.UserRole;
import com.backend.repository.CartRepository;
import com.backend.repository.NotificationRepository;
import com.backend.repository.OrderItemRepository;
import com.backend.repository.OrderRepository;
import com.backend.repository.ProductRepository;
import com.backend.repository.UserRepository;
import com.backend.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final String ORDER_NOT_FOUND = "Order not found";
    private static final String CART_EMPTY = "Cart is empty";
    private static final String FORBIDDEN_ORDER = "You can only access your own orders";
    private static final String INVALID_STATUS_TRANSITION = "Invalid order status transition";
    private static final String ORDER_NOT_CANCELLABLE = "Order cannot be cancelled";

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public GetOrderResponseDto checkout(CreateOrderRequestDto request) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, CART_EMPTY));

        List<CartItem> cartItems = cartService.getDetailedCartItems(cart.getId());
        if (cartItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, CART_EMPTY);
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProduct().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

            if (product.getStatus() != ProductStatus.ACTIVE) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product is not available: " + product.getName());
            }
            if (product.getStock() < cartItem.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock: " + product.getName());
            }

            BigDecimal unitPrice = CartService.resolveUnitPrice(product);
            BigDecimal subtotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            product.setStock(product.getStock() - cartItem.getQuantity());
            product.setSoldCount(product.getSoldCount() + cartItem.getQuantity());
            product.setUpdatedAt(OffsetDateTime.now());
            productRepository.save(product);

            orderItems.add(OrderItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .price(unitPrice)
                    .quantity(cartItem.getQuantity())
                    .subtotal(subtotal)
                    .build());
        }

        OffsetDateTime now = OffsetDateTime.now();
        ShopOrder order = ShopOrder.builder()
                .user(user)
                .totalAmount(totalAmount)
                .finalAmount(totalAmount)
                .status(OrderStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(PaymentStatusType.UNPAID)
                .createdAt(now)
                .updatedAt(now)
                .build();

        ShopOrder savedOrder = orderRepository.save(order);
        for (OrderItem orderItem : orderItems) {
            orderItem.setOrder(savedOrder);
        }
        orderItemRepository.saveAll(orderItems);
        cartService.clearCart(cart.getId());

        notificationRepository.save(Notification.builder()
                .user(user)
                .title("Order placed successfully")
                .message("Your order #" + savedOrder.getId() + " has been placed.")
                .build());

        return toOrderResponse(savedOrder, orderItems);
    }

    @Transactional(readOnly = true)
    public List<GetOrderResponseDto> getMyOrders() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(order -> toOrderResponse(order, orderItemRepository.findByOrderId(order.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public GetOrderResponseDto getOrderById(UUID orderId) {
        ShopOrder order = findAccessibleOrder(orderId);
        return toOrderResponse(order, orderItemRepository.findByOrderId(order.getId()));
    }

    @Transactional
    public GetOrderResponseDto cancelOrder(UUID orderId) {
        ShopOrder order = findAccessibleOrder(orderId);
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ORDER_NOT_CANCELLABLE);
        }

        restoreStock(order.getId());
        order.setStatus(OrderStatus.CANCELLED);
        order.setPaymentStatus(PaymentStatusType.REFUNDED);
        order.setUpdatedAt(OffsetDateTime.now());
        orderRepository.save(order);

        notificationRepository.save(Notification.builder()
                .user(order.getUser())
                .title("Order cancelled")
                .message("Your order #" + order.getId() + " has been cancelled.")
                .build());

        return toOrderResponse(order, orderItemRepository.findByOrderId(order.getId()));
    }

    @Transactional
    public GetOrderResponseDto updateOrderStatus(UUID orderId, UpdateOrderStatusRequestDto request) {
        SecurityUtils.requireRole(UserRole.ADMIN, UserRole.SELLER);
        ShopOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, ORDER_NOT_FOUND));

        assertValidTransition(order.getStatus(), request.getStatus());
        order.setStatus(request.getStatus());
        if (request.getStatus() == OrderStatus.DELIVERED) {
            order.setPaymentStatus(PaymentStatusType.PAID);
        }
        order.setUpdatedAt(OffsetDateTime.now());
        orderRepository.save(order);

        notificationRepository.save(Notification.builder()
                .user(order.getUser())
                .title("Order status updated")
                .message("Your order #" + order.getId() + " is now " + request.getStatus().name() + ".")
                .build());

        return toOrderResponse(order, orderItemRepository.findByOrderId(order.getId()));
    }

    private ShopOrder findAccessibleOrder(UUID orderId) {
        ShopOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, ORDER_NOT_FOUND));

        UUID currentUserId = SecurityUtils.getCurrentUserId();
        UserRole currentRole = SecurityUtils.getCurrentUser().role();
        if (currentRole != UserRole.ADMIN && !order.getUser().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, FORBIDDEN_ORDER);
        }
        return order;
    }

    private void restoreStock(UUID orderId) {
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
        for (OrderItem orderItem : orderItems) {
            productRepository.findById(orderItem.getProductId()).ifPresent(product -> {
                product.setStock(product.getStock() + orderItem.getQuantity());
                product.setSoldCount(Math.max(0, product.getSoldCount() - orderItem.getQuantity()));
                product.setUpdatedAt(OffsetDateTime.now());
                productRepository.save(product);
            });
        }
    }

    private void assertValidTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == newStatus) {
            return;
        }
        boolean valid = switch (currentStatus) {
            case PENDING -> newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.CANCELLED;
            case CONFIRMED -> newStatus == OrderStatus.SHIPPING || newStatus == OrderStatus.CANCELLED;
            case SHIPPING -> newStatus == OrderStatus.DELIVERED;
            case DELIVERED, CANCELLED -> false;
        };
        if (!valid) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_STATUS_TRANSITION);
        }
    }

    private GetOrderResponseDto toOrderResponse(ShopOrder order, List<OrderItem> orderItems) {
        return GetOrderResponseDto.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .totalAmount(order.getTotalAmount())
                .finalAmount(order.getFinalAmount())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .items(orderItems.stream().map(this::toOrderItemDto).toList())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private GetOrderItemResponseDto toOrderItemDto(OrderItem orderItem) {
        return GetOrderItemResponseDto.builder()
                .id(orderItem.getId())
                .productId(orderItem.getProductId())
                .productName(orderItem.getProductName())
                .price(orderItem.getPrice())
                .quantity(orderItem.getQuantity())
                .subtotal(orderItem.getSubtotal())
                .build();
    }
}
