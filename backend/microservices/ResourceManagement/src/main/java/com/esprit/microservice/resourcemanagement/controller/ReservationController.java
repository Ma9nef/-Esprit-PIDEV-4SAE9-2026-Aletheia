package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.dto.request.CreateReservationRequest;
import com.esprit.microservice.resourcemanagement.dto.response.ReservationResponse;
import com.esprit.microservice.resourcemanagement.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    /**
     * POST /api/reservations
     * Create a new reservation.
     * Enforces conflict detection with pessimistic locking.
     * Requires ADMIN or INSTRUCTOR role.
     */
    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(
            @Valid @RequestBody CreateReservationRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        ReservationResponse response = reservationService.createReservation(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/reservations?eventId=
     * Retrieve reservations filtered by eventId.
     */
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getReservations(
            @RequestParam String eventId) {
        return ResponseEntity.ok(reservationService.getReservationsByEventId(eventId));
    }

    /**
     * GET /api/reservations/{id}
     * Retrieve a single reservation by UUID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getReservationById(@PathVariable UUID id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    /**
     * PUT /api/reservations/{id}/confirm
     * Confirm a pending reservation.
     * Requires ADMIN role.
     */
    @PutMapping("/{id}/confirm")
    public ResponseEntity<ReservationResponse> confirmReservation(
            @PathVariable UUID id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.ok(reservationService.confirmReservation(id, userId));
    }

    /**
     * PUT /api/reservations/{id}/cancel
     * Cancel a reservation. Frees the resource for the time slot.
     * Uses optimistic locking to handle concurrent cancellation attempts.
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ReservationResponse> cancelReservation(
            @PathVariable UUID id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        return ResponseEntity.ok(reservationService.cancelReservation(id, userId));
    }
}
