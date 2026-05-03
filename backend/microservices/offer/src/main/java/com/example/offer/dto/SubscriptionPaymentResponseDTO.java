package com.example.offer.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SubscriptionPaymentResponseDTO {
    private String paymentId;
    private String userId;
    private String planId;
    private String planName;
    private String subscriptionId;
    private String subscriptionNumber;
    private Double amount;
    private String currency;
    private String provider;
    private String status;
    private String transactionReference;
    private String failureReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime paidAt;
}
