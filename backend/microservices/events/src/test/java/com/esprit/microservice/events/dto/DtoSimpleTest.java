package com.esprit.microservice.events.dto;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class DtoSimpleTest {

    @Test
    void sentimentResponseDTO_Builder_ShouldWork() {
        SentimentResponseDTO dto = SentimentResponseDTO.builder()
                .sentiment("POSITIVE")
                .confidence(0.95)
                .build();

        assertThat(dto.getSentiment()).isEqualTo("POSITIVE");
        assertThat(dto.getConfidence()).isEqualTo(0.95);
    }

    @Test
    void eventDTO_ShouldHaveDefaults() {
        EventDTO dto = new EventDTO();
        dto.setTitle("Test");
        
        assertThat(dto.getTitle()).isEqualTo("Test");
    }

    @Test
    void recommendationRequestDTO_Builder_ShouldWork() {
        RecommendationRequestDTO request = RecommendationRequestDTO.builder()
                .userId(1L)
                .limit(10)
                .build();

        assertThat(request.getUserId()).isEqualTo(1L);
        assertThat(request.getLimit()).isEqualTo(10);
    }
}
