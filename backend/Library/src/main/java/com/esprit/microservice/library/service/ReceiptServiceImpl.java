package com.esprit.microservice.library.service;

import com.esprit.microservice.library.entity.Order;
import com.esprit.microservice.library.entity.Receipt;
import com.esprit.microservice.library.enums.OrderStatus;
import com.esprit.microservice.library.repository.OrderRepository;
import com.esprit.microservice.library.repository.ReceiptRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class ReceiptServiceImpl implements ReceiptService {

    private final ReceiptRepository receiptRepository;
    private final OrderRepository orderRepository;
    public static final Long userId = 1L;


    public ReceiptServiceImpl(ReceiptRepository receiptRepository,
                              OrderRepository orderRepository) {
        this.receiptRepository = receiptRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public Receipt generate(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getStatus() != OrderStatus.PAID) {
            throw new IllegalStateException("Cannot generate receipt for unpaid order");
        }

        Receipt receipt = new Receipt();
        receipt.setOrderId(orderId);
        receipt.setReceiptNumber("ALETHEIA-" + UUID.randomUUID());
        receipt.setIssuedAt(LocalDateTime.now());

        return receiptRepository.save(receipt);
    }
}
