package com.esprit.microservice.events.service;

import com.esprit.microservice.events.dto.SentimentResponseDTO;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SentimentSimpleTest {

    @Test
    void errorResponse_ShouldReturnNeutral() {
        SentimentResponseDTO error = SentimentResponseDTO.error();
        
        assertThat(error).isNotNull();
        assertThat(error.getSentiment()).isEqualTo("NEUTRAL");
    }

    @Test
    void builder_ShouldCreateValidResponse() {
        SentimentResponseDTO response = SentimentResponseDTO.builder()
                .sentiment("POSITIVE")
                .confidence(0.95)
                .positiveScore(0.9)
                .neutralScore(0.05)
                .negativeScore(0.05)
                .processingTimeMs(100L)
                .build();

        assertThat(response.getSentiment()).isEqualTo("POSITIVE");
        assertThat(response.getConfidence()).isEqualTo(0.95);
    }
}
