package com.esprit.microservice.library.service;

import com.esprit.microservice.library.entity.Order;

import java.util.List;

public interface OrderService {
    Order checkout(Long userId);
    Order getById(Long id);
    List<Order> getByUserId(Long userId);
}
