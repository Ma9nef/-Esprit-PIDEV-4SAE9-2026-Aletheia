package com.esprit.microservice.library.service;


import com.esprit.microservice.library.client.UserServiceClient;
import com.esprit.microservice.library.dto.UserDto;
import com.esprit.microservice.library.entity.Cart;
import com.esprit.microservice.library.entity.Order;
import com.esprit.microservice.library.entity.OrderItem;
import com.esprit.microservice.library.enums.OrderStatus;
import com.esprit.microservice.library.repository.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final CartService cartService;
    private final OrderRepository orderRepository;
    public static final Long userId = 1L;

    @Autowired(required = false)
    private UserServiceClient userServiceClient;

    public OrderServiceImpl(CartService cartService,
                            OrderRepository orderRepository) {
        this.cartService = cartService;
        this.orderRepository = orderRepository;
    }

    @Override
    public Order checkout(Long userId) {
        // Validate user exists via Feign call to User microservice
        validateUserExists(userId);

        Cart cart = cartService.getActiveCart(userId);

        if (cart.getItems().isEmpty())
            throw new IllegalStateException("Cart is empty");

        Order order = new Order();
        order.setUserId(userId);
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = cart.getItems().stream().map(ci -> {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProductId(ci.getProduct().getId());
            oi.setProductTitle(ci.getProduct().getTitle());
            oi.setPriceAtPurchase(ci.getProduct().getPrice());
            oi.setQuantity(ci.getQuantity());
            oi.setFileUrl(ci.getProduct().getFileUrl());
            oi.setCoverImageUrl(ci.getProduct().getCoverImageUrl());
            oi.setProductType(ci.getProduct().getType());
            return oi;
        }).toList();

        order.setItems(orderItems);
        order.setTotalAmount(cart.calculateTotal());
        order.setStatus(OrderStatus.PAID);

        cart.setCheckedOut(true);

        return orderRepository.save(order);
    }

    @Override
    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    @Override
    public List<Order> getByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Validates that the given userId corresponds to an active user
     * in the User microservice (called via OpenFeign).
     *
     * If the User service is unavailable, checkout proceeds with a warning
     * to avoid blocking purchases due to a downstream service failure.
     */
    private void validateUserExists(Long userId) {
        if (userServiceClient == null) {
            log.warn("UserServiceClient not available — skipping user validation for userId={}", userId);
            return;
        }
        try {
            UserDto user = userServiceClient.getUserById(userId);
            log.info("User validation passed: id={}, email={}", user.getId(), user.getEmail());
        } catch (Exception e) {
            log.warn("User service unreachable or user not found for userId={}: {} — proceeding with checkout",
                    userId, e.getMessage());
        }
    }
}
