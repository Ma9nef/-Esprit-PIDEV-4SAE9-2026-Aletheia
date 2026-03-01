package com.esprit.microservice.library.controller;


import com.esprit.microservice.library.entity.Order;
import com.esprit.microservice.library.service.OrderService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    public static final Long userId = 1L;


    public OrderController(OrderService orderService) {
        this.orderService = orderService;
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