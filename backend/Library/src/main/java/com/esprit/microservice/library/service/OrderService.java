package com.esprit.microservice.library.service;

import com.esprit.microservice.library.entity.Order;

public interface OrderService {
    Order checkout(Long userId);
    Order getById(Long id);
}
