package com.sareeplatform.backend.service;

import com.sareeplatform.backend.dto.request.PlaceOrderRequest;
import com.sareeplatform.backend.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse placeOrder(String userEmail, PlaceOrderRequest request);
    List<OrderResponse> getMyOrders(String userEmail);
    OrderResponse getById(Long id, String userEmail);
    List<OrderResponse> getAllOrders();
    OrderResponse updateStatus(Long id, String status);
}
