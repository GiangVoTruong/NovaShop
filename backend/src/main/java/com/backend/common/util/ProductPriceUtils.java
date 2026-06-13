package com.backend.common.util;

import java.math.BigDecimal;

import com.backend.features.product.Product;

public final class ProductPriceUtils {

    private ProductPriceUtils() {
    }

    public static BigDecimal resolveUnitPrice(Product product) {
        return product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
    }
}
