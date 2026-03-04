package com.esprit.microservice.library.service;


import com.esprit.microservice.library.entity.Cart;
import com.esprit.microservice.library.entity.Order;
import com.esprit.microservice.library.entity.OrderItem;
import com.esprit.microservice.library.enums.OrderStatus;
import com.esprit.microservice.library.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final CartService cartService;
    private final OrderRepository orderRepository;
    public static final Long userId = 1L;


    public OrderServiceImpl(CartService cartService,
                            OrderRepository orderRepository) {
        this.cartService = cartService;
        this.orderRepository = orderRepository;
    }

    @Override
    public Order checkout(Long userId) {
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
}
