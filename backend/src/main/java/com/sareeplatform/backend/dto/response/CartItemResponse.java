package com.sareeplatform.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CartItemResponse {
    private Long productId;
    private String productName;
    private String productImageUrl;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
}
