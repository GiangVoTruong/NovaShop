package com.backend.features.product.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import com.backend.features.product.dto.GetCategoryResponseDto;
import com.backend.features.product.dto.GetProductResponseDto;
import com.backend.features.product.Category;
import com.backend.features.product.Product;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface ProductMapper {

    @Mapping(target = "sellerId", source = "seller.id")
    @Mapping(target = "sellerName", source = "seller.fullName")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "imageUrls", ignore = true)
    @Mapping(target = "primaryImageUrl", ignore = true)
    GetProductResponseDto toDto(Product product);

    List<GetProductResponseDto> toDtoList(List<Product> products);

    @Mapping(target = "parentId", source = "parent.id")
    GetCategoryResponseDto toCategoryDto(Category category);

    List<GetCategoryResponseDto> toCategoryDtoList(List<Category> categories);
}
