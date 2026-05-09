package com.sareeplatform.backend.service.impl;

import com.sareeplatform.backend.dto.request.AddToCartRequest;
import com.sareeplatform.backend.dto.request.UpdateCartItemRequest;
import com.sareeplatform.backend.dto.response.CartItemResponse;
import com.sareeplatform.backend.dto.response.CartResponse;
import com.sareeplatform.backend.entity.Cart;
import com.sareeplatform.backend.entity.CartItem;
import com.sareeplatform.backend.entity.Product;
import com.sareeplatform.backend.entity.User;
import com.sareeplatform.backend.exception.BadRequestException;
import com.sareeplatform.backend.exception.ResourceNotFoundException;
import com.sareeplatform.backend.repository.CartRepository;
import com.sareeplatform.backend.repository.ProductRepository;
import com.sareeplatform.backend.repository.UserRepository;
import com.sareeplatform.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public CartResponse getCart(String userEmail) {
        User user = getUser(userEmail);
        Cart cart = getOrCreateCart(user);
        return toResponse(cart);
    }

    @Override
    public CartResponse addItem(String userEmail, AddToCartRequest request) {
        User user = getUser(userEmail);
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.isActive()) {
            throw new BadRequestException("Product is not available");
        }
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock");
        }

        CartItem existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(request.getProductId()))
                .findFirst().orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + request.getQuantity());
        } else {
            CartItem item = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(item);
        }

        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    public CartResponse updateItem(String userEmail, Long productId, UpdateCartItemRequest request) {
        User user = getUser(userEmail);
        Cart cart = getOrCreateCart(user);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Item not in cart"));

        item.setQuantity(request.getQuantity());
        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    public CartResponse removeItem(String userEmail, Long productId) {
        User user = getUser(userEmail);
        Cart cart = getOrCreateCart(user);
        cart.getItems().removeIf(i -> i.getProduct().getId().equals(productId));
        cartRepository.save(cart);
        return toResponse(cart);
    }

    @Override
    public void clearCart(String userEmail) {
        User user = getUser(userEmail);
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));
    }

    private CartResponse toResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream().map(item -> {
            String imageUrl = item.getProduct().getImages() != null && !item.getProduct().getImages().isEmpty()
                    ? item.getProduct().getImages().get(0).getImageUrl() : null;
            BigDecimal subtotal = item.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));
            return CartItemResponse.builder()
                    .productId(item.getProduct().getId())
                    .productName(item.getProduct().getName())
                    .productImageUrl(imageUrl)
                    .price(item.getProduct().getPrice())
                    .quantity(item.getQuantity())
                    .subtotal(subtotal)
                    .build();
        }).collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .id(cart.getId())
                .items(items)
                .totalItems(items.stream().mapToInt(CartItemResponse::getQuantity).sum())
                .totalAmount(total)
                .build();
    }
}
