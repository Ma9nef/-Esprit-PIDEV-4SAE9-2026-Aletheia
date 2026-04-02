package com.example.offer.dto;



import com.example.offer.model.OfferStatus;
import lombok.Data;

import java.time.LocalDateTime;

    @Data
    public class CouponResponseDTO {
        private String id;
        private String code;
        private String offerId;
        private String description;

        // Type de coupon
        private Boolean isUnique;        // true = usage unique / false = partagé

        // Si coupon personnel
        private String assignedUserId;

        // Restrictions
        private LocalDateTime validFrom;
        private LocalDateTime validUntil;
        private Integer remainingUses;    // Pour codes partagés
        private Integer maxUses;          // Nombre maximum d'utilisations

        // Statut
        private OfferStatus status;

        // Métadonnées
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

    }

