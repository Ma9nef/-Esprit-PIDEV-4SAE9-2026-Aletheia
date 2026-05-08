package com.example.offer.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Data
@Document(collection = "subscription_plans")
public class SubscriptionPlan {

    @Id
    private String id;

    @Indexed(unique = true)
    private String name;                 // Nom du plan (ex: "PREMIUM_MENSUEL")

    private String description;
    private Double price;
    private Integer durationDays;        // Durée en jours
    private Integer maxCourses;          // Nombre max de cours
    private Boolean certificationIncluded;
    private Boolean isActive;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}