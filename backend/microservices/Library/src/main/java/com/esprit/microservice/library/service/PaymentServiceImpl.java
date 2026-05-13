package com.esprit.microservice.library.service;

import com.esprit.microservice.library.entity.Order;
import com.esprit.microservice.library.entity.Payment;
import com.esprit.microservice.library.enums.OrderStatus;
import com.esprit.microservice.library.enums.PaymentStatus;
import com.esprit.microservice.library.repository.OrderRepository;
import com.esprit.microservice.library.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    public static final Long userId = 1L;


    public PaymentServiceImpl(OrderRepository orderRepository,
                              PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Payment pay(Long orderId, String provider) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setAmount(order.getTotalAmount());
        payment.setProvider(provider);
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionRef(UUID.randomUUID().toString());
        payment.setPaidAt(LocalDateTime.now());

        order.setStatus(OrderStatus.PAID);

        return paymentRepository.save(payment);
    }
}
