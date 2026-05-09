package com.sareeplatform.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemResponse {
    private Long productId;
    private String productName;
    private String productImageUrl;
    private BigDecimal priceAtOrder;
    private Integer quantity;
    private BigDecimal subtotal;
}
