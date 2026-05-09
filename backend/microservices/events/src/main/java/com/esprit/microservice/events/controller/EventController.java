package com.esprit.microservice.events.controller;

import com.esprit.microservice.events.dto.EventDTO;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EventController {

    private final EventService eventService;
    private final RecommendationService recommendationService;
    private final CategoryMappingService categoryMappingService;

    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventDTO eventDTO) {
        Event event = convertToEntity(eventDTO);
        Event createdEvent = eventService.createEvent(event);
        return new ResponseEntity<>(convertToDTO(createdEvent), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        List<EventDTO> dtos = eventService.getAllEvents().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(convertToDTO(event));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Long id, @RequestBody EventDTO eventDTO) {
        Event event = convertToEntity(eventDTO);
        Event updatedEvent = eventService.updateEvent(id, event);
        return ResponseEntity.ok(convertToDTO(updatedEvent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<EventDTO>> getEventsByStatus(@PathVariable EventStatus status) {
        List<EventDTO> dtos = eventService.getEventsByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/organizer/{organizer}")
    public ResponseEntity<List<EventDTO>> getEventsByOrganizer(@PathVariable String organizer) {
        List<EventDTO> dtos = eventService.getEventsByOrganizer(organizer).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDTO>> getUpcomingEvents() {
        List<EventDTO> dtos = eventService.getUpcomingEvents().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<EventDTO>> getEventsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<EventDTO> dtos = eventService.getEventsByDateRange(start, end).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EventDTO> updateEventStatus(
            @PathVariable Long id,
            @RequestParam EventStatus status) {
        Event event = eventService.updateEventStatus(id, status);
        return ResponseEntity.ok(convertToDTO(event));
    }

    @GetMapping("/{id}/canceled")
    public ResponseEntity<Boolean> isEventCanceled(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.isEventCanceled(id));
    }

    // ============ RECOMMENDATION ENDPOINTS ============

    @GetMapping("/recommendations/user/{userId}")
    public ResponseEntity<List<EventDTO>> getRecommendationsForUser(
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

        List<EventDTO> dtos = recommendations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
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

    // ============ METHODES DE CONVERSION ============

    private EventDTO convertToDTO(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStartDate(event.getStartDate());
        dto.setEndDate(event.getEndDate());
        dto.setLocation(event.getLocation());
        dto.setExpectedAttendees(event.getExpectedAttendees());
        dto.setOrganizer(event.getOrganizer());
        dto.setStatus(event.getStatus());
        return dto;
    }

    private Event convertToEntity(EventDTO dto) {
        Event event = new Event();
        event.setId(dto.getId());
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setStartDate(dto.getStartDate());
        event.setEndDate(dto.getEndDate());
        event.setLocation(dto.getLocation());
        event.setExpectedAttendees(dto.getExpectedAttendees());
        event.setOrganizer(dto.getOrganizer());
        event.setStatus(dto.getStatus());
        return event;
    }
}