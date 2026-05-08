package com.esprit.microservice.events.controller;

import com.esprit.microservice.events.dto.MLPredictionResponse;
import com.esprit.microservice.events.service.MLPredictionService;
import com.esprit.microservice.events.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ml-test")
@RequiredArgsConstructor
@CrossOrigin("*")
@Slf4j
public class MLTestController {

    private final MLPredictionService mlPredictionService;
    private final RecommendationService recommendationService;

    /**
     * Tester la prédiction pour un utilisateur et un événement
     * GET /api/ml-test/predict?userId=42&eventId=10&interaction=CLICK
     */
    @GetMapping("/predict")
    public ResponseEntity<MLPredictionResponse> testPrediction(
            @RequestParam Long userId,
            @RequestParam Long eventId,
            @RequestParam(defaultValue = "CLICK") String interaction,
            @RequestParam(defaultValue = "Conference") String category) {

        MLPredictionResponse response = mlPredictionService.predict(userId, eventId, interaction, category);
        return ResponseEntity.ok(response);
    }

    /**
     * Vérifier la santé du service ML
     * GET /api/ml-test/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkMLHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("ml_service_available", recommendationService.isMLServiceAvailable());
        status.put("ml_api_url", "${ml.recommendation.api.url}");

        return ResponseEntity.ok(status);
    }

    /**
     * Tester les recommandations pour un utilisateur
     * GET /api/ml-test/recommendations/42?limit=5&use_ml_score=true
     */
    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<?> testRecommendations(
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