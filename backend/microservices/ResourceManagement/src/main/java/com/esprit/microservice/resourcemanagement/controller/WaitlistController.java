package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.dto.request.CreateWaitlistRequest;
import com.esprit.microservice.resourcemanagement.dto.response.WaitlistEntryResponse;
import com.esprit.microservice.resourcemanagement.service.WaitlistService;
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
@RequestMapping("/api/waitlist")
@RequiredArgsConstructor
public class WaitlistController {

    private final WaitlistService waitlistService;

    @GetMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<List<WaitlistEntryResponse>> listOwn() {
        return ResponseEntity.ok(waitlistService.listOwn(currentUser()));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<WaitlistEntryResponse> join(
            @Valid @RequestBody CreateWaitlistRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(waitlistService.join(req, currentUser()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<Void> leave(@PathVariable UUID id) {
        waitlistService.leave(id, currentUser());
        return ResponseEntity.noContent().build();
    }

    private String currentUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
