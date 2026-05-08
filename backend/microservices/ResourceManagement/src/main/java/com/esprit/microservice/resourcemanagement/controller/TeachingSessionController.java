package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.dto.request.CreateTeachingSessionRequest;
import com.esprit.microservice.resourcemanagement.dto.response.TeachingSessionResponse;
import com.esprit.microservice.resourcemanagement.service.TeachingSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
public class TeachingSessionController {

    private final TeachingSessionService teachingSessionService;

    @GetMapping
    public ResponseEntity<List<TeachingSessionResponse>> list() {
        return ResponseEntity.ok(teachingSessionService.listOwn(currentUser()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TeachingSessionResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(teachingSessionService.getById(id, currentUser()));
    }

    @PostMapping
    public ResponseEntity<TeachingSessionResponse> create(
            @Valid @RequestBody CreateTeachingSessionRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(teachingSessionService.create(req, currentUser()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeachingSessionResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody CreateTeachingSessionRequest req) {
        return ResponseEntity.ok(teachingSessionService.update(id, req, currentUser()));
    }

    private String currentUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
