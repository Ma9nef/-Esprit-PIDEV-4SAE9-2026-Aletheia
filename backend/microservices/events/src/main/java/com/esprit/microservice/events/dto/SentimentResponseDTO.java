package com.esprit.microservice.events.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SentimentResponseDTO {
    private String sentiment;
    private Double confidence;
    private Integer labelId;
    private Boolean isPositive;
    private Boolean isNegative;
    private Double positiveScore;
    private Double neutralScore;
    private Double negativeScore;
    private Long processingTimeMs;

    public static SentimentResponseDTO error() {
        return SentimentResponseDTO.builder()
                .sentiment("NEUTRAL")
                .confidence(0.0)
                .isPositive(false)
                .isNegative(false)
                .positiveScore(0.0)
                .neutralScore(1.0)
                .negativeScore(0.0)
                .build();
    }
}