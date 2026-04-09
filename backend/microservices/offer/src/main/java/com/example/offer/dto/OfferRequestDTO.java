 package com.example.offer.dto;

import com.example.offer.model.OfferType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

    @Data
    public class OfferRequestDTO {

        private String name;
        private String description;
        private OfferType type;              // On reçoit String (ex: "PERCENTAGE")
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
    }


