package com.example.offer.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "subscription_payments")
public class SubscriptionPayment {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String planId;

    @Indexed
    private String subscriptionId;

    private String subscriptionNumber;
    private String planName;
    private Double amount;
    private String currency;
    private String provider;
    private SubscriptionPaymentStatus status;

    @Indexed(unique = true, sparse = true)
    private String stripeSessionId;

    @Indexed(sparse = true)
    private String stripePaymentIntentId;

    private String checkoutUrl;
    private String transactionReference;
    private String failureReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime paidAt;
}
