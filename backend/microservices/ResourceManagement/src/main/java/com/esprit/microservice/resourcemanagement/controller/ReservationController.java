package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.dto.request.CancelReservationRequest;
import com.esprit.microservice.resourcemanagement.dto.request.CreateRecurrenceReservationRequest;
import com.esprit.microservice.resourcemanagement.dto.request.CreateReservationRequest;
import com.esprit.microservice.resourcemanagement.dto.request.RejectReservationRequest;
import com.esprit.microservice.resourcemanagement.dto.response.RecurrenceBookingResult;
import com.esprit.microservice.resourcemanagement.dto.response.ReservationResponse;
import com.esprit.microservice.resourcemanagement.service.RecurrenceService;
import com.esprit.microservice.resourcemanagement.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final RecurrenceService recurrenceService;

    // ── List ─────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> list() {
        String user = currentUser();
        boolean isAdmin = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        List<ReservationResponse> result = isAdmin
                ? reservationService.listAll()
                : reservationService.listForInstructor(user);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(reservationService.getById(id));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<ReservationResponse>> getByGroup(@PathVariable UUID groupId) {
        return ResponseEntity.ok(reservationService.getByRecurrenceGroup(groupId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservationResponse>> getPending() {
        return ResponseEntity.ok(reservationService.getPending());
    }

    @GetMapping("/swappable")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<List<ReservationResponse>> getSwappable() {
        return ResponseEntity.ok(reservationService.listSwappable(currentUser()));
    }

    // ── Create ────────────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<ReservationResponse> create(
            @Valid @RequestBody CreateReservationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationService.create(req, currentUser()));
    }

    @PostMapping("/recurrence")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<RecurrenceBookingResult> createRecurring(
            @Valid @RequestBody CreateRecurrenceReservationRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(recurrenceService.createRecurring(req, currentUser()));
    }

    // ── Admin approval ────────────────────────────────────────────────────

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationResponse> approve(@PathVariable UUID id) {
        return ResponseEntity.ok(reservationService.approve(id, currentUser()));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservationResponse> reject(
            @PathVariable UUID id,
            @Valid @RequestBody RejectReservationRequest req) {
        return ResponseEntity.ok(reservationService.reject(id, req, currentUser()));
    }

    // ── Cancel ────────────────────────────────────────────────────────────

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<ReservationResponse> cancel(
            @PathVariable UUID id,
            @RequestBody(required = false) CancelReservationRequest req) {
        if (req == null) req = new CancelReservationRequest();
        return ResponseEntity.ok(reservationService.cancel(id, req, currentUser()));
    }

    @DeleteMapping("/group/{groupId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cancelGroup(@PathVariable UUID groupId) {
        reservationService.cancelGroup(groupId, currentUser());
        return ResponseEntity.noContent().build();
    }

    // ── Helper ────────────────────────────────────────────────────────────

    private String currentUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
