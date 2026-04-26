package com.example.offer.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "subscription_notifications")
public class SubscriptionNotification {

    @Id
    private String id;

    @Indexed
    private NotificationRecipientType recipientType;

    @Indexed(sparse = true)
    private String recipientId;

    @Indexed
    private SubscriptionNotificationType type;

    private String title;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;

    @Indexed(sparse = true)
    private String relatedSubscriptionId;

    @Indexed(sparse = true)
    private String relatedPlanId;

    @Indexed(unique = true, sparse = true)
    private String deduplicationKey;
}
