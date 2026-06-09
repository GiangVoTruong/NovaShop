package com.backend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.dto.cart.AddCartItemRequestDto;
import com.backend.dto.cart.GetCartItemResponseDto;
import com.backend.dto.cart.GetCartResponseDto;
import com.backend.dto.cart.UpdateCartItemRequestDto;
import com.backend.entity.Cart;
import com.backend.entity.CartItem;
import com.backend.entity.Product;
import com.backend.entity.User;
import com.backend.enums.ProductStatus;
import com.backend.repository.CartItemRepository;
import com.backend.repository.CartRepository;
import com.backend.repository.ProductImageRepository;
import com.backend.repository.ProductRepository;
import com.backend.repository.UserRepository;
import com.backend.security.SecurityUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

    private static final String PRODUCT_NOT_AVAILABLE = "Product is not available";
    private static final String INSUFFICIENT_STOCK = "Insufficient stock";
    private static final String CART_ITEM_NOT_FOUND = "Cart item not found";

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public GetCartResponseDto getMyCart() {
        Cart cart = getOrCreateCart();
        return buildCartResponse(cart);
    }

    @Transactional
    public GetCartResponseDto addItem(AddCartItemRequestDto request) {
        Cart cart = getOrCreateCart();
        Product product = findAvailableProduct(request.getProductId());
        assertStock(product, request.getQuantity());

        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .map(existingItem -> {
                    int newQuantity = existingItem.getQuantity() + request.getQuantity();
                    assertStock(product, newQuantity);
                    existingItem.setQuantity(newQuantity);
                    return existingItem;
                })
                .orElseGet(() -> CartItem.builder()
                .cart(cart)
                .product(product)
                .quantity(request.getQuantity())
                .build());

        cartItemRepository.save(cartItem);
        return buildCartResponse(cart);
    }

    @Transactional
    public GetCartResponseDto updateItem(UUID cartItemId, UpdateCartItemRequestDto request) {
        Cart cart = getOrCreateCart();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .filter(item -> item.getCart().getId().equals(cart.getId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, CART_ITEM_NOT_FOUND));

        assertStock(cartItem.getProduct(), request.getQuantity());
        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);
        return buildCartResponse(cart);
    }

    @Transactional
    public GetCartResponseDto removeItem(UUID cartItemId) {
        Cart cart = getOrCreateCart();
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .filter(item -> item.getCart().getId().equals(cart.getId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, CART_ITEM_NOT_FOUND));
        cartItemRepository.delete(cartItem);
        return buildCartResponse(cart);
    }

    @Transactional
    public void clearCart(UUID cartId) {
        cartItemRepository.deleteByCartId(cartId);
    }

    @Transactional(readOnly = true)
    public List<CartItem> getDetailedCartItems(UUID cartId) {
        return cartItemRepository.findDetailedByCartId(cartId);
    }

    private Cart getOrCreateCart() {
        UUID userId = SecurityUtils.getCurrentUserId();
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
            return cartRepository.save(Cart.builder().user(user).build());
        });
    }

    private GetCartResponseDto buildCartResponse(Cart cart) {
        List<CartItem> cartItems = cartItemRepository.findDetailedByCartId(cart.getId());
        List<GetCartItemResponseDto> items = new ArrayList<>(cartItems.size());
        BigDecimal totalAmount = BigDecimal.ZERO;
        int itemCount = 0;
        for (CartItem cartItem : cartItems) {
            GetCartItemResponseDto item = toCartItemDto(cartItem);
            items.add(item);
            if (item.getSubtotal() != null) {
                totalAmount = totalAmount.add(item.getSubtotal());
            }
            itemCount += item.getQuantity();
        }

        return GetCartResponseDto.builder()
                .id(cart.getId())
                .items(items)
                .totalAmount(totalAmount)
                .itemCount(itemCount)
                .build();
    }

    private GetCartItemResponseDto toCartItemDto(CartItem cartItem) {
        Product product = cartItem.getProduct();
        BigDecimal unitPrice = resolveUnitPrice(product);
        String imageUrl = productImageRepository.findByProductIdAndIsPrimaryTrue(product.getId())
                .map(image -> image.getUrl())
                .orElse(null);

        return GetCartItemResponseDto.builder()
                .id(cartItem.getId())
                .productId(product.getId())
                .productName(product.getName())
                .productSlug(product.getSlug())
                .imageUrl(imageUrl)
                .unitPrice(unitPrice)
                .quantity(cartItem.getQuantity())
                .subtotal(unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                .availableStock(product.getStock())
                .build();
    }

    private Product findAvailableProduct(UUID productId) {
        return productRepository.findById(productId)
                .filter(product -> product.getStatus() == ProductStatus.ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, PRODUCT_NOT_AVAILABLE));
    }

    private void assertStock(Product product, int requestedQuantity) {
        if (product.getStock() == null || product.getStock() < requestedQuantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INSUFFICIENT_STOCK);
        }
    }

    static BigDecimal resolveUnitPrice(Product product) {
        return product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
    }
}
