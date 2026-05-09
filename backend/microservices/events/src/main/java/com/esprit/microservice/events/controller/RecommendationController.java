package com.esprit.microservice.events.controller;

import com.esprit.microservice.events.dto.MLPredictionResponse;
import com.esprit.microservice.events.dto.PredictionRequestDTO;
import com.esprit.microservice.events.dto.RecommendationRequestDTO;
import com.esprit.microservice.events.entity.Event;
import com.esprit.microservice.events.repository.EventRepository;
import com.esprit.microservice.events.service.MLPredictionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
@CrossOrigin("*")
@Slf4j
public class RecommendationController {

    private final MLPredictionService mlPredictionService;
    private final EventRepository eventRepository;

    private static final String DEFAULT_INTERACTION = "CLICK";
    private static final String DEFAULT_CATEGORY = "Conference";

    @PostMapping("/predict")
    public ResponseEntity<MLPredictionResponse> predict(
            @RequestBody PredictionRequestDTO request) {

        log.info("📊 Prédiction: userId={}, eventId={}", request.getUserId(), request.getEventId());

        String interactionType = request.getInteractionType() != null ? request.getInteractionType() : DEFAULT_INTERACTION;
        String category = request.getCategory() != null ? request.getCategory() : DEFAULT_CATEGORY;

        MLPredictionResponse response = mlPredictionService.predict(
                request.getUserId(),
                request.getEventId(),
                interactionType,
                category
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<MLPredictionResponse>> predictBatch(
            @RequestBody RecommendationRequestDTO request) {

        List<Event> events = eventRepository.findAll();

        List<MLPredictionResponse> responses = events.stream()
                .limit(20)
                .map(event -> mlPredictionService.predict(
                        request.getUserId(),
                        event.getId(),
                        DEFAULT_INTERACTION,
                        DEFAULT_CATEGORY
                ))
                .toList();

        return ResponseEntity.ok(responses);
    }
}