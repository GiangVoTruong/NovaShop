package com.backend.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.dto.products.GetProductResponseDto;
import com.backend.dto.wishlist.GetWishlistItemResponseDto;
import com.backend.dto.wishlist.GetWishlistResponseDto;
import com.backend.dto.wishlist.WishlistCheckResponseDto;
import com.backend.entity.Product;
import com.backend.entity.User;
import com.backend.entity.WishlistItem;
import com.backend.repository.ProductRepository;
import com.backend.repository.UserRepository;
import com.backend.repository.WishlistItemRepository;
import com.backend.security.SecurityUtils;
import com.github.f4b6a3.uuid.UuidCreator;

import lombok.RequiredArgsConstructor;

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
        List<GetWishlistItemResponseDto> items = wishlistItemRepository.findByUser_IdOrderByAddedAtDesc(userId).stream()
                .map(this::toDto)
                .filter(item -> item != null)
                .toList();
        return GetWishlistResponseDto.builder().items(items).build();
    }

    @Transactional
    public GetWishlistItemResponseDto addItem(UUID productId) {
        UUID userId = SecurityUtils.getCurrentUserId();
        User user = findUser(userId);

        return wishlistItemRepository.findByUser_IdAndProduct_Id(userId, productId)
                .map(this::toDto)
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
