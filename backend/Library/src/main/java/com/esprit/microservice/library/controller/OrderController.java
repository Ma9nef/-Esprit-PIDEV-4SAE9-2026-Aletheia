package com.esprit.microservice.library.controller;


import com.esprit.microservice.library.entity.Order;
import com.esprit.microservice.library.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<Order> getOrdersByUser(@RequestParam Long userId) {
        return orderService.getByUserId(userId);
    }

    @PostMapping("/checkout")
    public Order checkout(@RequestParam Long userId) {
        return orderService.checkout(userId);
    }

    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Long id) {
        return orderService.getById(id);
    }
}