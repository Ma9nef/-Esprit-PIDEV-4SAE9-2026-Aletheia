package com.example.offer.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SubscriptionPlanRequestDTO {

    private String name;                 // Nom du plan (ex: "PREMIUM_MENSUEL")
    private String description;           // Description du plan
    private Double price;                 // Prix du plan
    private Integer durationDays;         // Durée en jours (30, 365, etc.)

    // Limitations
    private Integer maxCourses;           // Nombre max de cours accessibles
    private Boolean certificationIncluded; // Certifications incluses ?

    // Statut
    private Boolean isActive = true;       // Plan actif ou non
}