package com.esprit.microservice.library.repository;

import com.esprit.microservice.library.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {}

