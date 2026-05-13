package com.esprit.microservice.library.controller;


import com.esprit.microservice.library.entity.Payment;
import com.esprit.microservice.library.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    public static final Long userId = 1L;


    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/{orderId}")
    public Payment pay(
            @PathVariable Long orderId,
            @RequestParam(defaultValue = "LOCAL") String provider) {
        return paymentService.pay(orderId, provider);
    }
}
