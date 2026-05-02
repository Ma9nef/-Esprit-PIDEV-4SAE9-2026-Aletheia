package com.example.offer.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SubscriptionNotificationResponseDTO {
    private String notificationId;
    private String recipientType;
    private String recipientId;
    private String type;
    private String title;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
    private String relatedSubscriptionId;
    private String relatedPlanId;
}
