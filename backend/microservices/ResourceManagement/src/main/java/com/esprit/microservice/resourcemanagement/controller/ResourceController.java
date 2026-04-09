package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.dto.request.CreateResourceRequest;
import com.esprit.microservice.resourcemanagement.dto.request.UpdateResourceRequest;
import com.esprit.microservice.resourcemanagement.dto.response.ResourceResponse;
import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import com.esprit.microservice.resourcemanagement.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    /**
     * POST /api/resources
     * Create a new resource (room, device, or material).
     * Requires ADMIN role.
     */
    @PostMapping
    public ResponseEntity<ResourceResponse> createResource(
            @Valid @RequestBody CreateResourceRequest request) {
        ResourceResponse response = resourceService.createResource(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * GET /api/resources
     * Retrieve all active resources, optionally filtered by type.
     */
    @GetMapping
    public ResponseEntity<List<ResourceResponse>> getAllResources(
            @RequestParam(required = false) ResourceType type) {
        List<ResourceResponse> resources;
        if (type != null) {
            resources = resourceService.getResourcesByType(type);
        } else {
            resources = resourceService.getAllResources();
        }
        return ResponseEntity.ok(resources);
    }

    /**
     * GET /api/resources/{id}
     * Retrieve a single resource by its UUID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponse> getResourceById(@PathVariable UUID id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    /**
     * PUT /api/resources/{id}
     * Update an existing resource. Partial updates supported.
     * Requires ADMIN role.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponse> updateResource(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateResourceRequest request) {
        return ResponseEntity.ok(resourceService.updateResource(id, request));
    }

    /**
     * DELETE /api/resources/{id}
     * Soft-delete a resource.
     * Requires ADMIN role.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable UUID id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
