package com.example.offer.dto;

import lombok.Data;

@Data
public class SubscriptionCheckoutRequestDTO {
    private String userId;
    private String planId;
    private String successUrl;
    private String cancelUrl;
}
