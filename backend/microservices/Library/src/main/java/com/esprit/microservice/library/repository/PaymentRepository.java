package com.esprit.microservice.library.repository;


import com.esprit.microservice.library.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {}

