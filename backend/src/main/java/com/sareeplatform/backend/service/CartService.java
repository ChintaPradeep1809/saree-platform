package com.sareeplatform.backend.service;

import com.sareeplatform.backend.dto.request.AddToCartRequest;
import com.sareeplatform.backend.dto.request.UpdateCartItemRequest;
import com.sareeplatform.backend.dto.response.CartResponse;

public interface CartService {
    CartResponse getCart(String userEmail);
    CartResponse addItem(String userEmail, AddToCartRequest request);
    CartResponse updateItem(String userEmail, Long productId, UpdateCartItemRequest request);
    CartResponse removeItem(String userEmail, Long productId);
    void clearCart(String userEmail);
}
