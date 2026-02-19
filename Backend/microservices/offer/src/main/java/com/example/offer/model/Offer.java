package com.example.offer.model;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.annotation.Id;


    @Data
    @Document(collection = "offers")
    public class Offer {
        @Id
        private String id;

        private String name;              // Nom de l'offre
        private String description;        // Description détaillée
        private OfferType type;            // Type de réduction
        private Double value;              // Valeur de la réduction (20 pour 20%, 10 pour 10€)

        // Ciblage
        private List<String> courseIds;    // IDs des cours concernés (null = tous)
        private List<String> categoryIds;  // IDs des catégories concernées
        private List<String> userIds;       // IDs des utilisateurs éligibles (null = tous)

        // Période de validité
        private LocalDateTime startDate;
        private LocalDateTime endDate;

        // Restrictions d'utilisation
        private Integer maxUses;            // Nombre maximum d'utilisations total
        private Integer maxUsesPerUser;     // Nombre maximum par utilisateur
        private Integer currentUses;        // Nombre d'utilisations actuelles


        private OfferStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;


    }
