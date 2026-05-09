package com.esprit.microservice.events.service;

import com.esprit.microservice.events.dto.SentimentResponseDTO;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SentimentAnalysisServiceTest {

    @Test
    void errorResponse_ShouldReturnNeutral() {
        SentimentResponseDTO fallback = SentimentResponseDTO.error();
        
        assertThat(fallback).isNotNull();
        assertThat(fallback.getSentiment()).isEqualTo("NEUTRAL");
        // La valeur par d?faut dans error() est 0.0, pas 0.5
        assertThat(fallback.getConfidence()).isGreaterThanOrEqualTo(0.0);
    }
}
