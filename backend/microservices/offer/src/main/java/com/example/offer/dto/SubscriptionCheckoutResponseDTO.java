package com.example.offer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionCheckoutResponseDTO {
    private boolean success;
    private String message;
    private String checkoutUrl;
    private String sessionId;
    private String paymentId;
    private String subscriptionId;
}
