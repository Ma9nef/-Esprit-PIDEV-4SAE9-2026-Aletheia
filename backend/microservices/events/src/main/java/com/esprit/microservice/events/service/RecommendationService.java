package com.esprit.microservice.events.service;

import com.esprit.microservice.events.client.RecommendationClient;
import com.esprit.microservice.events.dto.*;
import com.esprit.microservice.events.entity.Event;
import com.esprit.microservice.events.repository.EventRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendationService {

    private final RecommendationClient recommendationClient;
    private final EventRepository eventRepository;
    private final MLPredictionService mlPredictionService;
    private final CategoryMappingService categoryMappingService;

    @Value("${ml.recommendation.enabled:true}")
    private boolean mlEnabled;

    @Cacheable(value = "recommendationsCache", key = "#userId")
    public List<Event> getRecommendationsForUser(Long userId, Integer limit) {
        log.info("Getting recommendations for user: {}", userId);

        if (!mlEnabled) {
            return getFallbackRecommendations(limit);
        }

        try {
            RecommendationRequestDTO request = RecommendationRequestDTO.builder()
                    .userId(userId)
                    .limit(limit != null ? limit : 10)
                    .build();

            RecommendationResponseDTO response = recommendationClient.getRecommendations(request);

            if (response != null && response.getRecommendations() != null && !response.getRecommendations().isEmpty()) {
                List<Long> recommendedIds = response.getRecommendations().stream()
                        .map(RecommendedEventDTO::getEventId)
                        .toList();

                List<Event> events = eventRepository.findAllById(recommendedIds);

                Map<Long, Event> eventMap = events.stream()
                        .collect(Collectors.toMap(Event::getId, e -> e));

                return recommendedIds.stream()
                        .map(eventMap::get)
                        .filter(Objects::nonNull)
                        .limit(limit)
                        .toList();
            }

            return getFallbackRecommendations(limit);

        } catch (FeignException e) {
            log.error("Error calling recommendation API: {}", e.getMessage());
            return getFallbackRecommendations(limit);
        }
    }

    public List<Event> getRecommendationsByMLScore(Long userId, Integer limit) {
        log.info("Getting ML score based recommendations for user: {}", userId);

        List<Event> allEvents = eventRepository.findAll();

        if (allEvents.isEmpty()) {
            return new ArrayList<>();
        }

        int maxEvents = Math.min(allEvents.size(), 50);
        List<Event> eventsToScore = allEvents.subList(0, maxEvents);

        List<MLPredictionResponse> predictions = eventsToScore.parallelStream()
                .map(event -> {
                    String category = categoryMappingService.extractCategoryFromEvent(event);
                    try {
                        return mlPredictionService.predict(userId, event.getId(), "CLICK", category);
                    } catch (Exception e) {
                        log.warn("Error predicting for event {}: {}", event.getId(), e.getMessage());
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .filter(pred -> pred.getWill_like() != null && pred.getWill_like())
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .limit(limit)
                .toList();

        return predictions.stream()
                .map(pred -> eventRepository.findById(pred.getEvent_id()).orElse(null))
                .filter(Objects::nonNull)
                .toList();
    }

    private List<Event> getFallbackRecommendations(Integer limit) {
        log.info("Using fallback recommendations (upcoming events)");
        return eventRepository.findUpcomingEvents(LocalDateTime.now())
                .stream()
                .limit(limit != null ? limit : 10)
                .toList();
    }

    public boolean isMLServiceAvailable() {
        if (!mlEnabled) return false;

        try {
            Map<String, Object> health = recommendationClient.health();
            return health != null && "ok".equals(health.get("status"));
        } catch (Exception e) {
            log.warn("ML service is not available: {}", e.getMessage());
            return false;
        }
    }

    public List<Event> getHybridRecommendations(Long userId, Integer limit) {
        Set<Event> recommendations = new LinkedHashSet<>();

        if (mlEnabled) {
            List<Event> mlRecs = getRecommendationsByMLScore(userId, limit);
            recommendations.addAll(mlRecs);
        }

        if (recommendations.size() < limit) {
            List<Event> fallback = getFallbackRecommendations(limit);
            recommendations.addAll(fallback);
        }

        return recommendations.stream().limit(limit).toList();
    }
}