package com.esprit.microservice.events.service;

import com.esprit.microservice.events.dto.MLPredictionRequest;
import com.esprit.microservice.events.dto.MLPredictionResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

@Service
@RequiredArgsConstructor
@Slf4j
public class MLPredictionService {

    private final RestTemplate restTemplate;

    @Value("${ml.recommendation.api.url:http://localhost:5000}")
    private String mlApiUrl;

    /**
     * Prédiction simple pour un utilisateur et un événement
     */
    public MLPredictionResponse predict(Long userId, Long eventId, String interactionType, String category) {
        MLPredictionRequest request = MLPredictionRequest.builder()
                .user_id(userId)
                .event_id(eventId)
                .interaction_type(interactionType != null ? interactionType : "CLICK")
                .category(category != null ? category : "Conference")
                .weight(2.0) // Poids par défaut pour CLICK
                .build();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<MLPredictionRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<MLPredictionResponse> response = restTemplate.exchange(
                    mlApiUrl + "/predict",
                    HttpMethod.POST,
                    entity,
                    MLPredictionResponse.class
            );

            log.debug("Prédiction ML: userId={}, eventId={}, score={}, willLike={}",
                    userId, eventId, response.getBody().getScore(), response.getBody().getWill_like());

            return response.getBody();
        } catch (RestClientException e) {
            log.error("Erreur appel API ML: {}", e.getMessage());
            // Fallback: prédiction par défaut
            return MLPredictionResponse.builder()
                    .user_id(userId)
                    .event_id(eventId)
                    .score(0.5)
                    .will_like(false)
                    .confidence(0.5)
                    .threshold(0.5)
                    .build();
        }
    }
}