package com.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.constants.NotificationI18nKeys;
import com.backend.dto.orders.AdminOrderResponseDto;
import com.backend.dto.orders.CreateOrderRequestDto;
import com.backend.dto.orders.GetOrderItemResponseDto;
import com.backend.dto.orders.GetOrderResponseDto;
import com.backend.dto.orders.OrderShippingAddressDto;
import com.backend.dto.orders.UpdateOrderStatusRequestDto;
import com.backend.entity.Address;
import com.backend.entity.Cart;
import com.backend.entity.CartItem;
import com.backend.entity.OrderItem;
import com.backend.entity.Product;
import com.backend.entity.ShopOrder;
import com.backend.entity.User;
import com.backend.enums.NotificationType;
import com.backend.enums.OrderStatus;
import com.backend.enums.PaymentStatusType;
import com.backend.enums.ProductStatus;
import com.backend.enums.UserRole;
import com.backend.repository.CartRepository;
import com.backend.repository.OrderItemRepository;
import com.backend.repository.OrderRepository;
import com.backend.repository.ProductRepository;
import com.backend.repository.UserRepository;
import com.backend.security.SecurityUtils;
import com.backend.util.PaginationUtils;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final String ORDER_NOT_FOUND = "Order not found";
    private static final String CART_EMPTY = "Cart is empty";
    private static final String FORBIDDEN_ORDER = "You can only access your own orders";
    private static final String INVALID_STATUS_TRANSITION = "Invalid order status transition";
    private static final String ORDER_NOT_CANCELLABLE = "Order cannot be cancelled";
    private static final Set<String> ADMIN_ORDER_SORT_FIELDS = Set.of("createdAt", "finalAmount", "status");

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final AddressService addressService;
    private final CouponService couponService;

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

        Address shippingAddress = addressService.getOwnedAddress(userId, request.getAddressId());
        String orderNote = normalizeNote(request.getNote());

        BigDecimal shippingFee = BigDecimal.ZERO;
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            discountAmount = couponService.computeDiscountForCheckout(request.getCouponCode(), totalAmount);
        }

        BigDecimal finalAmount = totalAmount.subtract(discountAmount).add(shippingFee);
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
        }

        OffsetDateTime now = OffsetDateTime.now();
        ShopOrder order = ShopOrder.builder()
                .user(user)
                .shippingAddress(shippingAddress)
                .shippingFullName(shippingAddress.getFullName())
                .shippingPhone(shippingAddress.getPhone())
                .shippingProvince(shippingAddress.getProvince())
                .shippingDistrict(shippingAddress.getDistrict())
                .shippingWard(shippingAddress.getWard())
                .shippingDetail(shippingAddress.getDetail())
                .note(orderNote)
                .totalAmount(totalAmount)
                .finalAmount(finalAmount)
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

        notificationService.createI18n(
                user,
                NotificationType.ORDER_STATUS,
                NotificationI18nKeys.ORDER_PLACED,
                Map.of("orderId", savedOrder.getId().toString()));
        notificationService.notifyStaffNewOrder(savedOrder);

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

    @Transactional(readOnly = true)
    public Page<AdminOrderResponseDto> getAllOrdersAdmin(
            OrderStatus status,
            String keyword,
            LocalDate fromDate,
            LocalDate toDate,
            int page,
            int size,
            String sortBy,
            String sortDir) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        Pageable pageable = PaginationUtils.toPageable(page, size, resolveAdminSortField(sortBy), sortDir);
        Specification<ShopOrder> specification = buildAdminOrderSpecification(status, keyword, fromDate, toDate);
        return orderRepository.findAll(specification, pageable)
                .map(order -> toAdminOrderDto(order, false));
    }

    @Transactional(readOnly = true)
    public AdminOrderResponseDto getAdminOrderById(UUID orderId) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        ShopOrder order = orderRepository.findDetailedById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, ORDER_NOT_FOUND));
        return toAdminOrderDto(order, true);
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

        notificationService.createI18n(
                order.getUser(),
                NotificationType.ORDER_STATUS,
                NotificationI18nKeys.ORDER_CANCELLED,
                Map.of("orderId", order.getId().toString()));

        return toOrderResponse(order, orderItemRepository.findByOrderId(order.getId()));
    }

    @Transactional
    public GetOrderResponseDto confirmOrderReceived(UUID orderId) {
        ShopOrder order = findAccessibleOrder(orderId);
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        if (!order.getUser().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, FORBIDDEN_ORDER);
        }
        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order is not awaiting receiver confirmation");
        }
        return applyStatusChange(order, OrderStatus.DELIVERED_PENDING_RECEIVER_CONFIRM);
    }

    @Transactional
    public GetOrderResponseDto updateOrderStatus(UUID orderId, UpdateOrderStatusRequestDto request) {
        SecurityUtils.requireRole(UserRole.ADMIN, UserRole.SELLER);
        ShopOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, ORDER_NOT_FOUND));

        return applyStatusChange(order, request.getStatus());
    }

    private GetOrderResponseDto applyStatusChange(ShopOrder order, OrderStatus newStatus) {
        assertValidTransition(order.getStatus(), newStatus);
        order.setStatus(newStatus);
        if (newStatus == OrderStatus.DELIVERED_PENDING_RECEIVER_CONFIRM) {
            order.setPaymentStatus(PaymentStatusType.PAID);
        }
        order.setUpdatedAt(OffsetDateTime.now());
        orderRepository.save(order);

        notificationService.createI18n(
                order.getUser(),
                NotificationType.ORDER_STATUS,
                NotificationI18nKeys.ORDER_STATUS_UPDATED,
                Map.of(
                        "orderId", order.getId().toString(),
                        "status", newStatus.name()));

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

    private Specification<ShopOrder> buildAdminOrderSpecification(
            OrderStatus status,
            String keyword,
            LocalDate fromDate,
            LocalDate toDate) {
        return (root, query, criteriaBuilder) -> {
            if (Long.class != query.getResultType() && long.class != query.getResultType()) {
                root.fetch("user", JoinType.INNER);
                query.distinct(true);
            }

            List<Predicate> predicates = new ArrayList<>();
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                var userJoin = root.join("user", JoinType.INNER);
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(userJoin.get("email")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(userJoin.get("fullName")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("id").as(String.class)), pattern)));
            }
            if (fromDate != null) {
                OffsetDateTime from = fromDate.atStartOfDay().atOffset(ZoneOffset.UTC);
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("createdAt"), from));
            }
            if (toDate != null) {
                OffsetDateTime toExclusive = toDate.plusDays(1).atStartOfDay().atOffset(ZoneOffset.UTC);
                predicates.add(criteriaBuilder.lessThan(root.get("createdAt"), toExclusive));
            }
            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private String resolveAdminSortField(String sortBy) {
        if (sortBy != null && ADMIN_ORDER_SORT_FIELDS.contains(sortBy)) {
            return sortBy;
        }
        return "createdAt";
    }

    private AdminOrderResponseDto toAdminOrderDto(ShopOrder order, boolean includeItems) {
        User customer = order.getUser();
        long itemCount = orderItemRepository.countByOrder_Id(order.getId());
        List<GetOrderItemResponseDto> items;
        if (includeItems) {
            List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());
            items = new ArrayList<>(orderItems.size());
            for (OrderItem orderItem : orderItems) {
                items.add(toOrderItemDto(orderItem));
            }
        } else {
            items = List.of();
        }

        return AdminOrderResponseDto.builder()
                .id(order.getId())
                .userId(customer.getId())
                .customerFullName(customer.getFullName())
                .customerEmail(customer.getEmail())
                .customerPhone(customer.getPhone())
                .totalAmount(order.getTotalAmount())
                .finalAmount(order.getFinalAmount())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .shippingAddress(toShippingAddressDto(order))
                .note(order.getNote())
                .itemCount((int) itemCount)
                .items(items)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private void assertValidTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        if (currentStatus == newStatus) {
            return;
        }
        boolean valid = switch (currentStatus) {
            case PENDING ->
                newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.CANCELLED;
            case CONFIRMED ->
                newStatus == OrderStatus.SHIPPING || newStatus == OrderStatus.CANCELLED;
            case SHIPPING ->
                newStatus == OrderStatus.DELIVERED;
            case DELIVERED ->
                newStatus == OrderStatus.DELIVERED_PENDING_RECEIVER_CONFIRM;
            case DELIVERED_PENDING_RECEIVER_CONFIRM, CANCELLED ->
                false;
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
                .shippingAddress(toShippingAddressDto(order))
                .note(order.getNote())
                .items(toOrderItemDtos(orderItems))
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private List<GetOrderItemResponseDto> toOrderItemDtos(List<OrderItem> orderItems) {
        List<GetOrderItemResponseDto> items = new ArrayList<>(orderItems.size());
        for (OrderItem orderItem : orderItems) {
            items.add(toOrderItemDto(orderItem));
        }
        return items;
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

    private OrderShippingAddressDto toShippingAddressDto(ShopOrder order) {
        if (order.getShippingFullName() == null
                && order.getShippingPhone() == null
                && order.getShippingProvince() == null
                && order.getShippingDistrict() == null
                && order.getShippingWard() == null
                && order.getShippingDetail() == null) {
            return null;
        }
        UUID addressId = order.getShippingAddress() != null ? order.getShippingAddress().getId() : null;
        return OrderShippingAddressDto.builder()
                .addressId(addressId)
                .fullName(order.getShippingFullName())
                .phone(order.getShippingPhone())
                .province(order.getShippingProvince())
                .district(order.getShippingDistrict())
                .ward(order.getShippingWard())
                .detail(order.getShippingDetail())
                .build();
    }

    private String normalizeNote(String note) {
        if (note == null) {
            return null;
        }
        String trimmed = note.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
