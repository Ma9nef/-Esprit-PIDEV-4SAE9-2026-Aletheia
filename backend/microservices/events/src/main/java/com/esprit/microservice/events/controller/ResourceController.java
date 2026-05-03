package com.esprit.microservice.events.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.esprit.microservice.events.entity.Resource;
import com.esprit.microservice.events.entity.ResourceType;
import com.esprit.microservice.events.service.ResourceService;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        Resource createdResource = resourceService.createResource(resource);
        return new ResponseEntity<>(createdResource, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable Long id, @RequestBody Resource resource) {
        return ResponseEntity.ok(resourceService.updateResource(id, resource));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Resource>> getResourcesByType(@PathVariable ResourceType type) {
        return ResponseEntity.ok(resourceService.getResourcesByType(type));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Resource>> getAvailableResources() {
        return ResponseEntity.ok(resourceService.getAvailableResources());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Resource>> searchResources(@RequestParam String name) {
        return ResponseEntity.ok(resourceService.searchResourcesByName(name));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<Boolean> checkResourceAvailability(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(resourceService.isResourceAvailable(id, quantity));
    }

    @PatchMapping("/{id}/quantity")
    public ResponseEntity<Resource> updateResourceQuantity(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(resourceService.updateResourceQuantity(id, quantity));
    }
}