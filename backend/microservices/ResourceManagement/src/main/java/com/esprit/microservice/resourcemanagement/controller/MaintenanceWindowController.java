package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.dto.request.CreateMaintenanceWindowRequest;
import com.esprit.microservice.resourcemanagement.dto.response.MaintenanceWindowResponse;
import com.esprit.microservice.resourcemanagement.service.MaintenanceWindowService;
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
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceWindowController {

    private final MaintenanceWindowService maintenanceWindowService;

    @GetMapping("/resource/{resourceId}")
    public ResponseEntity<List<MaintenanceWindowResponse>> listForResource(
            @PathVariable UUID resourceId) {
        return ResponseEntity.ok(maintenanceWindowService.listForResource(resourceId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MaintenanceWindowResponse> create(
            @Valid @RequestBody CreateMaintenanceWindowRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(maintenanceWindowService.create(req, currentUser()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        maintenanceWindowService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private String currentUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
