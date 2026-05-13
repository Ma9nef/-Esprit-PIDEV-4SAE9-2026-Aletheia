package com.example.offer.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Data
@Document(collection = "subscriptions")
public class Subscription {

    @Id
    private String id;

    @Indexed
    private String userId;                 // Référence à l'utilisateur

    @Indexed
    private String planId;                  // Référence au plan

    @Indexed(unique = true)
    private String subscriptionNumber;      // Numéro unique

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String status;                   // ACTIVE, EXPIRED, CANCELED, PENDING

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}