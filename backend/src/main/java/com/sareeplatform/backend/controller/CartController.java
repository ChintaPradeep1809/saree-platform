package com.sareeplatform.backend.controller;

import com.sareeplatform.backend.dto.request.AddToCartRequest;
import com.sareeplatform.backend.dto.request.UpdateCartItemRequest;
import com.sareeplatform.backend.dto.response.CartResponse;
import com.sareeplatform.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.getCart(user.getUsername()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            @AuthenticationPrincipal UserDetails user,
            @Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(cartService.addItem(user.getUsername(), request));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartResponse> updateItem(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long productId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.updateItem(user.getUsername(), productId, request));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartResponse> removeItem(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeItem(user.getUsername(), productId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails user) {
        cartService.clearCart(user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
