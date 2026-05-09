package com.esprit.microservice.events.controller;

import com.esprit.microservice.events.dto.MLPredictionResponse;
import com.esprit.microservice.events.service.MLPredictionService;
import com.esprit.microservice.events.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ml-test")
@RequiredArgsConstructor
@CrossOrigin("*")
@Slf4j
public class MLTestController {

    private final MLPredictionService mlPredictionService;
    private final RecommendationService recommendationService;

    // Constantes ajoutées
    private static final String KEY_ML_SERVICE_AVAILABLE = "ml_service_available";
    private static final String KEY_ML_API_URL = "ml_api_url";
    private static final String DEFAULT_CATEGORY = "Conference";
    private static final String DEFAULT_INTERACTION = "CLICK";

    @GetMapping("/predict")
    public ResponseEntity<MLPredictionResponse> testPrediction(
            @RequestParam Long userId,
            @RequestParam Long eventId,
            @RequestParam(defaultValue = DEFAULT_INTERACTION) String interaction,
            @RequestParam(defaultValue = DEFAULT_CATEGORY) String category) {

        MLPredictionResponse response = mlPredictionService.predict(userId, eventId, interaction, category);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkMLHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put(KEY_ML_SERVICE_AVAILABLE, recommendationService.isMLServiceAvailable());
        status.put(KEY_ML_API_URL, "${ml.recommendation.api.url}");

        return ResponseEntity.ok(status);
    }

    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<Object> testRecommendations(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "5") Integer limit,
            @RequestParam(defaultValue = "false") Boolean useMlScore) {

        if (useMlScore) {
            return ResponseEntity.ok(recommendationService.getRecommendationsByMLScore(userId, limit));
        } else {
            return ResponseEntity.ok(recommendationService.getRecommendationsForUser(userId, limit));
        }
    }
}