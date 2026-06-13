package com.backend.features.wishlist.service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.features.product.dto.GetProductResponseDto;
import com.backend.features.wishlist.dto.GetWishlistItemResponseDto;
import com.backend.features.wishlist.dto.GetWishlistResponseDto;
import com.backend.features.wishlist.dto.WishlistCheckResponseDto;
import com.backend.features.product.Product;
import com.backend.features.user.User;
import com.backend.features.wishlist.WishlistItem;
import com.backend.features.product.repository.ProductRepository;
import com.backend.features.user.repository.UserRepository;
import com.backend.features.wishlist.repository.WishlistItemRepository;
import com.backend.features.auth.security.SecurityUtils;
import com.github.f4b6a3.uuid.UuidCreator;

import lombok.RequiredArgsConstructor;
import com.backend.features.product.service.ProductService;
@Service
@RequiredArgsConstructor
public class WishlistService {

    private static final String USER_NOT_FOUND = "User not found";

    private final WishlistItemRepository wishlistItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    @Transactional(readOnly = true)
    public GetWishlistResponseDto getMyWishlist() {
        UUID userId = SecurityUtils.getCurrentUserId();
        List<WishlistItem> wishlistItems = wishlistItemRepository.findByUser_IdOrderByAddedAtDesc(userId);
        List<GetWishlistItemResponseDto> items = new ArrayList<>(wishlistItems.size());
        for (WishlistItem wishlistItem : wishlistItems) {
            GetWishlistItemResponseDto item = toDto(wishlistItem);
            if (item != null) {
                items.add(item);
            }
        }
        return GetWishlistResponseDto.builder().items(items).build();
    }

    @Transactional
    public GetWishlistItemResponseDto addItem(UUID productId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = findUser(userId);

        return wishlistItemRepository.findByUser_IdAndProduct_Id(userId, productId)
                .map(wishlistItem -> toDto(wishlistItem))
                .orElseGet(() -> {
                    Product product = productRepository.getReferenceById(productId);
                    OffsetDateTime now = OffsetDateTime.now();
                    WishlistItem wishlistItem = WishlistItem.builder()
                            .id(UuidCreator.getTimeOrderedEpoch())
                            .user(user)
                            .product(product)
                            .addedAt(now)
                            .build();
                    return toDto(wishlistItemRepository.save(wishlistItem));
                });
    }

    @Transactional
    public void removeItem(UUID productId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        wishlistItemRepository.deleteByUser_IdAndProduct_Id(userId, productId);
    }

    @Transactional(readOnly = true)
    public WishlistCheckResponseDto checkProduct(UUID productId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        boolean inWishlist = wishlistItemRepository.existsByUser_IdAndProduct_Id(userId, productId);
        return WishlistCheckResponseDto.builder().inWishlist(inWishlist).build();
    }

    private User findUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, USER_NOT_FOUND));
    }

    private GetWishlistItemResponseDto toDto(WishlistItem wishlistItem) {
        try {
            GetProductResponseDto product = productService.getProductById(wishlistItem.getProduct().getId());
            return GetWishlistItemResponseDto.builder()
                    .id(wishlistItem.getId())
                    .productId(wishlistItem.getProduct().getId())
                    .product(product)
                    .addedAt(wishlistItem.getAddedAt())
                    .build();
        } catch (ResponseStatusException exception) {
            return null;
        }
    }
}
