package com.example.offer.dto;

import com.example.offer.model.OfferStatus;
import com.example.offer.model.OfferType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

    @Data
    public class OfferResponseDTO {

        private String id;

        private String name;
        private String description;

        private OfferType type;     // Enum directe ici
        private Double value;

        // Ciblage
        private List<String> courseIds;
        private List<String> categoryIds;
        private List<String> userIds;

        // Période de validité
        private LocalDateTime startDate;
        private LocalDateTime endDate;

        // Restrictions
        private Integer maxUses;
        private Integer maxUsesPerUser;
        private Integer currentUses;

        // Statut
        private OfferStatus status;

        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }


