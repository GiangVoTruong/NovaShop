package com.backend.features.product.service;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.backend.features.product.dto.CreateCategoryRequestDto;
import com.backend.features.product.dto.GetCategoryResponseDto;
import com.backend.features.product.dto.UpdateCategoryRequestDto;
import com.backend.features.product.Category;
import com.backend.common.enums.UserRole;
import com.backend.features.product.mapper.ProductMapper;
import com.backend.features.product.repository.CategoryRepository;
import com.backend.features.product.repository.ProductRepository;
import com.backend.features.auth.security.SecurityUtils;
import com.backend.common.util.SlugUtils;
import com.github.f4b6a3.uuid.UuidCreator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private static final String CATEGORY_NOT_FOUND = "Category not found";
    private static final String SLUG_ALREADY_EXISTS = "Category slug already exists";
    private static final String CATEGORY_HAS_CHILDREN = "Category has child categories";
    private static final String CATEGORY_HAS_PRODUCTS = "Category has products";

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Transactional
    public GetCategoryResponseDto createCategory(CreateCategoryRequestDto request) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        String slug = resolveSlug(request.getSlug(), request.getName());
        if (categoryRepository.existsBySlug(slug)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, SLUG_ALREADY_EXISTS);
        }

        Category category = Category.builder()
                .id(UuidCreator.getTimeOrderedEpoch())
                .name(request.getName().trim())
                .slug(slug)
                .parent(resolveParent(request.getParentId()))
                .build();
        return productMapper.toCategoryDto(categoryRepository.save(category));
    }

    @Transactional
    public GetCategoryResponseDto updateCategory(UUID categoryId, UpdateCategoryRequestDto request) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        Category category = findCategory(categoryId);

        if (request.getName() != null && !request.getName().isBlank()) {
            category.setName(request.getName().trim());
        }
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            String slug = resolveSlug(request.getSlug(), category.getName());
            if (!slug.equals(category.getSlug()) && categoryRepository.existsBySlug(slug)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, SLUG_ALREADY_EXISTS);
            }
            category.setSlug(slug);
        }
        if (request.getParentId() != null) {
            if (request.getParentId().equals(categoryId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category cannot be its own parent");
            }
            category.setParent(resolveParent(request.getParentId()));
        }

        return productMapper.toCategoryDto(categoryRepository.save(category));
    }

    @Transactional
    public void deleteCategory(UUID categoryId) {
        SecurityUtils.requireRole(UserRole.ADMIN);
        findCategory(categoryId);
        if (categoryRepository.countByParentId(categoryId) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, CATEGORY_HAS_CHILDREN);
        }
        if (productRepository.countByCategory_Id(categoryId) > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, CATEGORY_HAS_PRODUCTS);
        }
        categoryRepository.deleteById(categoryId);
    }

    private Category findCategory(UUID categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, CATEGORY_NOT_FOUND));
    }

    private Category resolveParent(UUID parentId) {
        if (parentId == null) {
            return null;
        }
        return findCategory(parentId);
    }

    private String resolveSlug(String requestedSlug, String name) {
        if (requestedSlug != null && !requestedSlug.isBlank()) {
            return SlugUtils.toSlug(requestedSlug);
        }
        return SlugUtils.toSlug(name);
    }
}
