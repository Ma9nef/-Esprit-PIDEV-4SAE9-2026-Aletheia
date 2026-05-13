package com.esprit.microservice.events.controller;

import com.esprit.microservice.events.entity.EventCategory;
import com.esprit.microservice.events.service.CategoryMappingService;
import com.esprit.microservice.events.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.esprit.microservice.events.entity.Event;
import com.esprit.microservice.events.entity.EventStatus;
import com.esprit.microservice.events.service.EventService;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EventController {

    private final EventService eventService;
    private final RecommendationService recommendationService;
    private final CategoryMappingService categoryMappingService;

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event createdEvent = eventService.createEvent(event);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        return ResponseEntity.ok(eventService.updateEvent(id, event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Event>> getEventsByStatus(@PathVariable EventStatus status) {
        return ResponseEntity.ok(eventService.getEventsByStatus(status));
    }

    @GetMapping("/organizer/{organizer}")
    public ResponseEntity<List<Event>> getEventsByOrganizer(@PathVariable String organizer) {
        return ResponseEntity.ok(eventService.getEventsByOrganizer(organizer));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Event>> getEventsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(eventService.getEventsByDateRange(start, end));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Event> updateEventStatus(
            @PathVariable Long id,
            @RequestParam EventStatus status) {
        return ResponseEntity.ok(eventService.updateEventStatus(id, status));
    }

    @GetMapping("/{id}/canceled")
    public ResponseEntity<Boolean> isEventCanceled(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.isEventCanceled(id));
    }

    // ============ RECOMMENDATION ENDPOINTS ============

    @GetMapping("/recommendations/user/{userId}")
    public ResponseEntity<List<Event>> getRecommendationsForUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(defaultValue = "hybrid") String mode) {

        List<Event> recommendations;

        switch (mode.toLowerCase()) {
            case "ml":
                recommendations = recommendationService.getRecommendationsByMLScore(userId, limit);
                break;
            case "hybrid":
                recommendations = recommendationService.getHybridRecommendations(userId, limit);
                break;
            default:
                recommendations = recommendationService.getRecommendationsForUser(userId, limit);
        }

        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/recommendations/health")
    public ResponseEntity<Map<String, Object>> getRecommendationHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("ml_service_available", recommendationService.isMLServiceAvailable());
        health.put("service", "event-service");
        health.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(health);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<EventCategory>> getAllCategories() {
        return ResponseEntity.ok(eventService.getAllCategories());
    }

    @PostMapping("/categories/mapping")
    public ResponseEntity<Void> addCategoryMapping(
            @RequestParam String keyword,
            @RequestParam String category) {
        categoryMappingService.addKeywordMapping(keyword, category);
        return ResponseEntity.ok().build();
    }
}