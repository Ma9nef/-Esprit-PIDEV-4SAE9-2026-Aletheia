package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.dto.request.CheckAvailabilityRequest;
import com.esprit.microservice.resourcemanagement.dto.response.AvailabilityResponse;
import com.esprit.microservice.resourcemanagement.dto.response.ResourceResponse;
import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import com.esprit.microservice.resourcemanagement.service.AvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    /** POST /api/availability/check */
    @PostMapping("/check")
    public ResponseEntity<AvailabilityResponse> check(
            @Valid @RequestBody CheckAvailabilityRequest req) {
        return ResponseEntity.ok(availabilityService.check(req));
    }

    /**
     * POST /api/availability/suggest
     * Body: { resourceId, startTime, endTime, expectedAttendees }
     */
    @PostMapping("/suggest")
    public ResponseEntity<AvailabilityResponse> suggest(
            @RequestParam UUID resourceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime,
            @RequestParam(required = false) Integer expectedAttendees) {
        return ResponseEntity.ok(
                availabilityService.suggest(resourceId, startTime, endTime, expectedAttendees));
    }

    /**
     * GET /api/availability/browse?type=COMPUTER_LAB&date=2026-04-20&minCapacity=30
     */
    @GetMapping("/browse")
    public ResponseEntity<List<ResourceResponse>> browse(
            @RequestParam(required = false) ResourceType type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer minCapacity) {
        return ResponseEntity.ok(availabilityService.browse(type, date, minCapacity));
    }
}
