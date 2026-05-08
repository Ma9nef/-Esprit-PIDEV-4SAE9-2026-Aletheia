/*package com.esprit.microservice.events.controller;

import com.esprit.microservice.events.entity.Event;
import com.esprit.microservice.events.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events/recommendations")
@RequiredArgsConstructor
@CrossOrigin("*")
@Slf4j
public class EventRecommendationController {

    private final RecommendationService recommendationService;


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Event>> getUserRecommendations(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") Integer limit) {

        List<Event> recommendations = recommendationService.getRecommendationsForUser(userId, limit);
        return ResponseEntity.ok(recommendations);
    }


    @GetMapping("/user/{userId}/ml")
    public ResponseEntity<List<Event>> getUserRecommendationsML(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") Integer limit) {

        List<Event> recommendations = recommendationService.getRecommendationsByMLScore(userId, limit);
        return ResponseEntity.ok(recommendations);
    }


    @GetMapping("/user/{userId}/hybrid")
    public ResponseEntity<List<Event>> getUserRecommendationsHybrid(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") Integer limit) {

        List<Event> recommendations = recommendationService.getHybridRecommendations(userId, limit);
        return ResponseEntity.ok(recommendations);
    }


    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("ml_service_available", recommendationService.isMLServiceAvailable());
        status.put("service", "recommendation-service");
        status.put("status", "running");
        return ResponseEntity.ok(status);
    }
}*/