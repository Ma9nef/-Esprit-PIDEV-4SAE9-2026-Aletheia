package com.esprit.microservice.events.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PredictionRequestDTO {
    private Long userId;
    private Long eventId;
    private String interactionType;
    private String category;
    private Double weight;
}