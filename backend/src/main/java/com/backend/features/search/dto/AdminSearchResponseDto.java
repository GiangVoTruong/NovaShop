package com.backend.features.search.dto;

import java.util.List;

import com.backend.features.order.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminSearchResponseDto {

    private List<AdminSearchOrderDto> orders;
    private List<AdminSearchProductDto> products;
    private List<AdminSearchCustomerDto> customers;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminSearchOrderDto {
        private String id;
        private String orderCode;
        private String customerName;
        private OrderStatus status;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminSearchProductDto {
        private String id;
        private String name;
        private String slug;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminSearchCustomerDto {
        private String id;
        private String fullName;
        private String email;
    }
}
