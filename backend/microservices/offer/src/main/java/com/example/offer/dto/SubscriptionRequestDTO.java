package com.example.offer.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SubscriptionRequestDTO {

    private String userId;                 // ID de l'utilisateur
    private String planId;                  // ID du plan souscrit

    // Période d'abonnement
    private LocalDateTime startDate;        // Date de début (si null = maintenant)
    private LocalDateTime endDate;          // Date de fin (si null = calculée depuis plan)

    // Statut
    private String status = "PENDING";      // ACTIVE, EXPIRED, CANCELED, PENDING

}