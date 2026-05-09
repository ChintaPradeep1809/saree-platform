package com.sareeplatform.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer stockQuantity;
    private String sku;
    private String fabric;
    private String color;
    private String occasion;
    private boolean active;
    private Long categoryId;
    private String categoryName;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
}
