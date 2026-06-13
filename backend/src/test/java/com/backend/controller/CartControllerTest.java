package com.backend.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.JacksonJsonHttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.backend.features.cart.controller.CartController;
import com.backend.features.cart.dto.GetCartItemResponseDto;
import com.backend.features.cart.dto.GetCartResponseDto;
import com.backend.features.cart.service.CartService;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class CartControllerTest {

    private static final UUID CART_ID = UUID.fromString("22222222-2222-2222-2222-222222222222");
    private static final UUID PRODUCT_ID = UUID.fromString("33333333-3333-3333-3333-333333333333");
    private static final UUID CART_ITEM_ID = UUID.fromString("44444444-4444-4444-4444-444444444444");

    @Mock
    private CartService cartService;

    @InjectMocks
    private CartController cartController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    private MockMvc mockMvc() {
        if (mockMvc == null) {
            mockMvc = MockMvcBuilders.standaloneSetup(cartController)
                    .setMessageConverters(new JacksonJsonHttpMessageConverter())
                    .build();
            objectMapper = new ObjectMapper();
            objectMapper.findAndRegisterModules();
        }
        return mockMvc;
    }

    private ObjectMapper objectMapper() {
        mockMvc();
        return objectMapper;
    }

    private GetCartResponseDto sampleCartResponse() {
        return GetCartResponseDto.builder()
                .id(CART_ID)
                .items(List.of(
                        GetCartItemResponseDto.builder()
                                .id(CART_ITEM_ID)
                                .productId(PRODUCT_ID)
                                .productName("Test Product")
                                .productSlug("test-product")
                                .unitPrice(new BigDecimal("80000"))
                                .quantity(2)
                                .subtotal(new BigDecimal("160000"))
                                .availableStock(10)
                                .build()))
                .totalAmount(new BigDecimal("160000"))
                .itemCount(2)
                .build();
    }

    @Test
    void getMyCart_returns200() throws Exception {
        when(cartService.getMyCart()).thenReturn(sampleCartResponse());

        mockMvc().perform(get("/api/cart"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(CART_ID.toString()))
                .andExpect(jsonPath("$.data.itemCount").value(2))
                .andExpect(jsonPath("$.data.items[0].productName").value("Test Product"));

        verify(cartService).getMyCart();
    }

    @Test
    void addItem_returns200WithValidRequest() throws Exception {
        when(cartService.addItem(any())).thenReturn(sampleCartResponse());

        String body = objectMapper().writeValueAsString(
                java.util.Map.of("productId", PRODUCT_ID.toString(), "quantity", 2));

        mockMvc().perform(post("/api/cart/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalAmount").value(160000));

        verify(cartService).addItem(any());
    }

    @Test
    void addItem_returns400WhenQuantityInvalid() throws Exception {
        String body = objectMapper().writeValueAsString(
                java.util.Map.of("productId", PRODUCT_ID.toString(), "quantity", 0));

        mockMvc().perform(post("/api/cart/items")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateItem_returns200() throws Exception {
        when(cartService.updateItem(eq(CART_ITEM_ID), any())).thenReturn(sampleCartResponse());

        String body = objectMapper().writeValueAsString(java.util.Map.of("quantity", 3));

        mockMvc().perform(put("/api/cart/items/{itemId}", CART_ITEM_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Cập nhật giỏ hàng thành công"));

        verify(cartService).updateItem(eq(CART_ITEM_ID), any());
    }

    @Test
    void removeItem_returns200() throws Exception {
        GetCartResponseDto emptyCart = GetCartResponseDto.builder()
                .id(CART_ID)
                .items(List.of())
                .totalAmount(BigDecimal.ZERO)
                .itemCount(0)
                .build();
        when(cartService.removeItem(CART_ITEM_ID)).thenReturn(emptyCart);

        mockMvc().perform(delete("/api/cart/items/{itemId}", CART_ITEM_ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.itemCount").value(0));

        verify(cartService).removeItem(CART_ITEM_ID);
    }
}
