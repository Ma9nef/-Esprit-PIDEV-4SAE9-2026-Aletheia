package com.esprit.microservice.library.controller;


import com.esprit.microservice.library.entity.Order;
import com.esprit.microservice.library.entity.OrderItem;
import com.esprit.microservice.library.enums.ProductType;
import com.esprit.microservice.library.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    /**
     * Check if a user has purchased a specific product and return download info.
     * GET /api/orders/purchased?userId=1&productId=5
     */
    @GetMapping("/purchased")
    public ResponseEntity<?> checkPurchased(@RequestParam Long userId, @RequestParam Long productId) {
        List<Order> orders = orderService.getByUserId(userId);
        for (Order order : orders) {
            if (!"PAID".equals(order.getStatus().name())) continue;
            for (OrderItem item : order.getItems()) {
                if (item.getProductId().equals(productId)) {
                    boolean isDigital = item.getProductType() == ProductType.PDF
                            || item.getProductType() == ProductType.EXAM;
                    return ResponseEntity.ok(Map.of(
                            "purchased", true,
                            "digital", isDigital,
                            "fileUrl", item.getFileUrl() != null ? item.getFileUrl() : "",
                            "productType", item.getProductType() != null ? item.getProductType().name() : ""
                    ));
                }
            }
        }
        return ResponseEntity.ok(Map.of("purchased", false));
    }
}