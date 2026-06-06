package com.backend.service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.dto.categories.GetCategoryResponseDto;
import com.backend.dto.products.CreateProductRequestDto;
import com.backend.dto.products.GetProductResponseDto;
import com.backend.dto.products.UpdateProductRequestDto;
import com.backend.entity.Category;
import com.backend.entity.Product;
import com.backend.entity.ProductImage;
import com.backend.entity.User;
import com.backend.enums.ProductStatus;
import com.backend.enums.UserRole;
import com.backend.mapper.ProductMapper;
import com.backend.repository.CategoryRepository;
import com.backend.repository.ProductImageRepository;
import com.backend.repository.ProductRepository;
import com.backend.repository.UserRepository;
import com.backend.security.SecurityUtils;
import com.backend.util.SlugUtils;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

    private static final String PRODUCT_NOT_FOUND = "Product not found";
    private static final String CATEGORY_NOT_FOUND = "Category not found";
    private static final String SLUG_ALREADY_EXISTS = "Product slug already exists";
    private static final String INVALID_DISCOUNT_PRICE = "Discount price must be less than or equal to price";
    private static final String FORBIDDEN_PRODUCT = "You can only manage your own products";

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public Page<GetProductResponseDto> listProducts(
            String keyword,
            String categorySlug,
            String mode,
            UUID sellerId,
            Pageable pageable) {
        Specification<Product> specification = buildSpecification(keyword, categorySlug, mode, sellerId);
        return productRepository.findAll(specification, pageable).map(this::toDetailedDto);
    }

    @Transactional(readOnly = true)
    public GetProductResponseDto getProductById(UUID productId) {
        Product product = findActiveProduct(productId);
        return toDetailedDto(product);
    }

    @Transactional(readOnly = true)
    public GetProductResponseDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .filter(item -> item.getStatus() == ProductStatus.ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, PRODUCT_NOT_FOUND));
        return toDetailedDto(product);
    }

    @Transactional(readOnly = true)
    public List<GetCategoryResponseDto> getAllCategories() {
        return productMapper.toCategoryDtoList(categoryRepository.findAll());
    }

    @Transactional
    public GetProductResponseDto createProduct(CreateProductRequestDto request) {
        SecurityUtils.requireRole(UserRole.SELLER, UserRole.ADMIN);
        User seller = findCurrentUser();

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, CATEGORY_NOT_FOUND));

        validateDiscountPrice(request.getPrice(), request.getDiscountPrice());
        String slug = resolveUniqueSlug(request.getSlug(), request.getName());

        OffsetDateTime now = OffsetDateTime.now();
        Product product = Product.builder()
                .seller(seller)
                .category(category)
                .name(request.getName().trim())
                .slug(slug)
                .description(request.getDescription())
                .price(request.getPrice())
                .discountPrice(request.getDiscountPrice())
                .stock(request.getStock())
                .status(ProductStatus.ACTIVE)
                .createdAt(now)
                .updatedAt(now)
                .build();

        Product savedProduct = productRepository.save(product);
        saveImages(savedProduct, request.getImageUrls());
        return toDetailedDto(savedProduct);
    }

    @Transactional
    public GetProductResponseDto updateProduct(UUID productId, UpdateProductRequestDto request) {
        SecurityUtils.requireRole(UserRole.SELLER, UserRole.ADMIN);
        Product product = findManagedProduct(productId);

        if (request.getName() != null && !request.getName().isBlank()) {
            product.setName(request.getName().trim());
        }
        if (request.getDescription() != null) {
            product.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            product.setPrice(request.getPrice());
        }
        if (request.getDiscountPrice() != null) {
            product.setDiscountPrice(request.getDiscountPrice());
        }
        if (request.getStock() != null) {
            product.setStock(request.getStock());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, CATEGORY_NOT_FOUND));
            product.setCategory(category);
        }
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }

        validateDiscountPrice(product.getPrice(), product.getDiscountPrice());
        product.setUpdatedAt(OffsetDateTime.now());

        if (request.getImageUrls() != null) {
            productImageRepository.findByProductId(product.getId())
                    .forEach(productImageRepository::delete);
            saveImages(product, request.getImageUrls());
        }

        return toDetailedDto(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(UUID productId) {
        SecurityUtils.requireRole(UserRole.SELLER, UserRole.ADMIN);
        Product product = findManagedProduct(productId);
        product.setStatus(ProductStatus.DELETED);
        product.setUpdatedAt(OffsetDateTime.now());
        productRepository.save(product);
    }

    private Specification<Product> buildSpecification(
            String keyword,
            String categorySlug,
            String mode,
            UUID sellerId) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("status"), ProductStatus.ACTIVE));

            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern));
            }
            if (categorySlug != null && !categorySlug.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("slug"), categorySlug.trim()));
            }
            if ("flash-sale".equalsIgnoreCase(mode)) {
                predicates.add(criteriaBuilder.isNotNull(root.get("discountPrice")));
            }
            if (sellerId != null) {
                predicates.add(criteriaBuilder.equal(root.get("seller").get("id"), sellerId));
            }
            return criteriaBuilder.and(predicates.toArray(Predicate[]::new));
        };
    }

    private GetProductResponseDto toDetailedDto(Product product) {
        GetProductResponseDto response = productMapper.toDto(product);
        List<ProductImage> images = productImageRepository.findByProductId(product.getId());
        List<String> imageUrls = new ArrayList<>(images.size());
        String primaryImageUrl = null;
        for (ProductImage image : images) {
            if (image == null) {
                continue;
            }
            String url = image.getUrl();
            imageUrls.add(url);
            if (Boolean.TRUE.equals(image.getIsPrimary())) {
                primaryImageUrl = url;
            }
        }
        if (primaryImageUrl == null && !imageUrls.isEmpty()) {
            primaryImageUrl = imageUrls.getFirst();
        }
        response.setImageUrls(imageUrls);
        response.setPrimaryImageUrl(primaryImageUrl);
        return response;
    }

    private Product findActiveProduct(UUID productId) {
        return productRepository.findById(productId)
                .filter(product -> product.getStatus() == ProductStatus.ACTIVE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, PRODUCT_NOT_FOUND));
    }

    private Product findManagedProduct(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, PRODUCT_NOT_FOUND));

        User currentUser = findCurrentUser();
        if (currentUser.getRole() != UserRole.ADMIN
                && (product.getSeller() == null || !product.getSeller().getId().equals(currentUser.getId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, FORBIDDEN_PRODUCT);
        }
        return product;
    }

    private User findCurrentUser() {
        return userRepository.findById(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized"));
    }

    private String resolveUniqueSlug(String requestedSlug, String name) {
        String baseSlug = requestedSlug != null && !requestedSlug.isBlank()
                ? SlugUtils.toSlug(requestedSlug)
                : SlugUtils.toSlug(name);
        String slug = baseSlug;
        int suffix = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + suffix++;
        }
        if (productRepository.existsBySlug(slug)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, SLUG_ALREADY_EXISTS);
        }
        return slug;
    }

    private void validateDiscountPrice(BigDecimal price, BigDecimal discountPrice) {
        if (discountPrice != null && discountPrice.compareTo(price) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID_DISCOUNT_PRICE);
        }
    }

    private void saveImages(Product product, List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }
        boolean hasPrimary = false;
        for (String imageUrl : imageUrls) {
            if (imageUrl == null || imageUrl.isBlank()) {
                continue;
            }
            boolean primary = !hasPrimary;
            hasPrimary = hasPrimary || primary;
            productImageRepository.save(ProductImage.builder()
                    .product(product)
                    .url(imageUrl.trim())
                    .isPrimary(primary)
                    .build());
        }
    }
}
