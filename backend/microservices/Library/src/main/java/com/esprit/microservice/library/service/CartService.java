package com.esprit.microservice.library.service;

import com.esprit.microservice.library.entity.Cart;

public interface CartService {
    Cart getActiveCart(Long userId);
    Cart addProduct(Long userId, Long productId, int quantity);
    Cart removeItem(Long userId, Long cartItemId);
    void clearCart(Long userId);
}
