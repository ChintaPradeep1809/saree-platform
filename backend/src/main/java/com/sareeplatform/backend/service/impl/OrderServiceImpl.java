package com.sareeplatform.backend.service.impl;

import com.sareeplatform.backend.dto.request.PlaceOrderRequest;
import com.sareeplatform.backend.dto.response.OrderItemResponse;
import com.sareeplatform.backend.dto.response.OrderResponse;
import com.sareeplatform.backend.entity.*;
import com.sareeplatform.backend.exception.BadRequestException;
import com.sareeplatform.backend.exception.ResourceNotFoundException;
import com.sareeplatform.backend.repository.CartRepository;
import com.sareeplatform.backend.repository.OrderRepository;
import com.sareeplatform.backend.repository.ProductRepository;
import com.sareeplatform.backend.repository.UserRepository;
import com.sareeplatform.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public OrderResponse placeOrder(String userEmail, PlaceOrderRequest request) {
        User user = getUser(userEmail);
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for: " + product.getName());
            }

            String imageUrl = product.getImages() != null && !product.getImages().isEmpty()
                    ? product.getImages().get(0).getImageUrl() : null;

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            total = total.add(subtotal);

            orderItems.add(OrderItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .productImageUrl(imageUrl)
                    .priceAtOrder(product.getPrice())
                    .quantity(cartItem.getQuantity())
                    .build());

            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        Order order = Order.builder()
                .user(user)
                .totalAmount(total)
                .shippingName(request.getName())
                .shippingPhone(request.getPhone())
                .shippingAddressLine1(request.getAddressLine1())
                .shippingAddressLine2(request.getAddressLine2())
                .shippingCity(request.getCity())
                .shippingState(request.getState())
                .shippingPincode(request.getPincode())
                .notes(request.getNotes())
                .build();

        Order savedOrder = orderRepository.save(order);
        orderItems.forEach(item -> item.setOrder(savedOrder));
        savedOrder.setItems(orderItems);
        orderRepository.save(savedOrder);

        cart.getItems().clear();
        cartRepository.save(cart);

        return toResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getMyOrders(String userEmail) {
        User user = getUser(userEmail);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public OrderResponse getById(Long id, String userEmail) {
        User user = getUser(userEmail);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != User.Role.ADMIN) {
            throw new BadRequestException("Access denied");
        }
        return toResponse(order);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public OrderResponse updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        try {
            order.setStatus(Order.Status.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }
        return toResponse(orderRepository.save(order));
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream().map(item ->
                OrderItemResponse.builder()
                        .productId(item.getProductId())
                        .productName(item.getProductName())
                        .productImageUrl(item.getProductImageUrl())
                        .priceAtOrder(item.getPriceAtOrder())
                        .quantity(item.getQuantity())
                        .subtotal(item.getPriceAtOrder().multiply(BigDecimal.valueOf(item.getQuantity())))
                        .build()
        ).collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .status(order.getStatus().name())
                .items(items)
                .totalAmount(order.getTotalAmount())
                .shippingName(order.getShippingName())
                .shippingPhone(order.getShippingPhone())
                .shippingAddressLine1(order.getShippingAddressLine1())
                .shippingAddressLine2(order.getShippingAddressLine2())
                .shippingCity(order.getShippingCity())
                .shippingState(order.getShippingState())
                .shippingPincode(order.getShippingPincode())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
