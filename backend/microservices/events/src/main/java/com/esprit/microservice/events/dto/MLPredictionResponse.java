package com.esprit.microservice.events.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MLPredictionResponse {
    @JsonProperty("user_id")
    private Long user_id;

    @JsonProperty("event_id")
    private Long event_id;

    private Double score;

    @JsonProperty("will_like")
    private Boolean will_like;

    private Double confidence;
    private Double threshold;
}