package com.esprit.microservice.events.client;

import com.esprit.microservice.events.dto.RecommendationRequestDTO;
import com.esprit.microservice.events.dto.RecommendationResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(
        name = "recommendation-service",
        url = "${ml.recommendation.api.url:http://localhost:5000}"
)
public interface RecommendationClient {

    // ✅ CORRIGER: Changer "/recommend" en "/predict"
    @PostMapping("/predict")
    RecommendationResponseDTO getRecommendations(@RequestBody RecommendationRequestDTO request);

    // ✅ Garder le health check
    @GetMapping("/health")
    Map<String, Object> health();
}