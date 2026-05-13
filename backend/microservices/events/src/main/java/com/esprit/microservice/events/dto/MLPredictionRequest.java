package com.esprit.microservice.events.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MLPredictionRequest {
    private Long user_id;
    private Long event_id;
    private String interaction_type;
    private String category;
    private Double weight;
}