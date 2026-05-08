package com.esprit.microservice.events.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequestDTO {
    private Long userId;
    private String userEmail;
    private Integer limit;
    private List<String> preferredCategories;
    private String location;

    // ✅ AJOUTER CES CHAMPS POUR LA PRÉDICTION
    private Long eventId;
    private String interactionType;
    private String category;
    private Double weight;
}