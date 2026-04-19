package com.esprit.microservice.library.service;

import com.esprit.microservice.library.entity.Cart;
import com.esprit.microservice.library.entity.CartItem;
import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.repository.CartRepository;
import com.esprit.microservice.library.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
public class CartServiceImpl implements CartService {


    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    public static final Long userId = 1L;

    public CartServiceImpl(CartRepository cartRepository,
                           ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Cart getActiveCart(Long userId) {
        return cartRepository.findByUserIdAndCheckedOutFalse(userId)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUserId(userId);
                    return cartRepository.save(cart);
                });
    }

    @Override
    public Cart addProduct(Long userId, Long productId, int quantity) {
        Cart cart = getActiveCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(ci -> ci.getProduct().getId().equals(productId))
                .findFirst();

        if (existing.isPresent()) {
            existing.get().setQuantity(existing.get().getQuantity() + quantity);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            cart.getItems().add(item);
        }

        return cartRepository.save(cart);
    }

    @Override
    public Cart removeItem(Long userId, Long cartItemId) {
        Cart cart = getActiveCart(userId);
        cart.getItems().removeIf(ci -> ci.getId().equals(cartItemId));
        return cartRepository.save(cart);
    }

    @Override
    public void clearCart(Long userId) {
        Cart cart = getActiveCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
