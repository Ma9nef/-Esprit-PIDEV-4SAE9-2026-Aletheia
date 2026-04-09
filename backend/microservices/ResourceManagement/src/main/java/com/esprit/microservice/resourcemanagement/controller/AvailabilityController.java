package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.dto.request.CheckAvailabilityRequest;
import com.esprit.microservice.resourcemanagement.dto.request.CreateAvailabilityRequest;
import com.esprit.microservice.resourcemanagement.dto.response.AvailabilityCheckResponse;
import com.esprit.microservice.resourcemanagement.dto.response.AvailabilityResponse;
import com.esprit.microservice.resourcemanagement.service.ReservationService;
import com.esprit.microservice.resourcemanagement.service.ResourceAvailabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AvailabilityController {

    private final ResourceAvailabilityService availabilityService;
    private final ReservationService reservationService;

    /**
     * POST /api/resources/{id}/availability
     * Define a new availability window for a resource.
     * Requires ADMIN or INSTRUCTOR role.
     */
    @PostMapping("/resources/{id}/availability")
    public ResponseEntity<AvailabilityResponse> createAvailability(
            @PathVariable UUID id,
            @Valid @RequestBody CreateAvailabilityRequest request) {
        AvailabilityResponse response = availabilityService.createAvailability(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/resources/{id}/availability
     * List all availability windows for a given resource.
     */
    @GetMapping("/resources/{id}/availability")
    public ResponseEntity<List<AvailabilityResponse>> getAvailability(@PathVariable UUID id) {
        return ResponseEntity.ok(availabilityService.getAvailability(id));
    }

    /**
     * POST /api/resources/check-availability
     * Check if a resource (or a type of resource) is available for a time range.
     * Returns available resources and any conflicting reservations.
     */
    @PostMapping("/resources/check-availability")
    public ResponseEntity<AvailabilityCheckResponse> checkAvailability(
            @Valid @RequestBody CheckAvailabilityRequest request) {
        return ResponseEntity.ok(reservationService.checkAvailability(request));
    }
}
