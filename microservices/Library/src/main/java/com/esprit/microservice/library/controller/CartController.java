package com.esprit.microservice.library.controller;

import com.esprit.microservice.library.entity.Cart;
import com.esprit.microservice.library.service.CartService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    public static final Long userId = 1L;


    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public Cart getActiveCart(@RequestParam Long userId) {
        return cartService.getActiveCart(userId);
    }

    @PostMapping("/items")
    public Cart addProduct(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int quantity) {
        return cartService.addProduct(userId, productId, quantity);
    }

    @DeleteMapping("/items/{cartItemId}")
    public Cart removeItem(
            @RequestParam Long userId,
            @PathVariable Long cartItemId) {
        return cartService.removeItem(userId, cartItemId);
    }

    @DeleteMapping("/clear")
    public void clearCart(@RequestParam Long userId) {
        cartService.clearCart(userId);
    }
}
