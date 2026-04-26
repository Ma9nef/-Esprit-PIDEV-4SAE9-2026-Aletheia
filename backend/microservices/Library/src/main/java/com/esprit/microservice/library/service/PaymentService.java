package com.esprit.microservice.library.service;

import com.esprit.microservice.library.entity.Payment;

public interface PaymentService {
    Payment pay(Long orderId, String provider);
}
