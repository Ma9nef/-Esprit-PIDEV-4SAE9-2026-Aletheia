package com.esprit.microservice.events.controller;

import com.esprit.microservice.events.dto.ResourceDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.esprit.microservice.events.entity.Resource;
import com.esprit.microservice.events.entity.ResourceType;
import com.esprit.microservice.events.service.ResourceService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    public ResponseEntity<ResourceDTO> createResource(@RequestBody ResourceDTO resourceDTO) {
        Resource resource = convertToEntity(resourceDTO);
        Resource createdResource = resourceService.createResource(resource);
        return new ResponseEntity<>(convertToDTO(createdResource), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ResourceDTO>> getAllResources() {
        List<ResourceDTO> dtos = resourceService.getAllResources().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceDTO> getResourceById(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(convertToDTO(resource));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceDTO> updateResource(@PathVariable Long id, @RequestBody ResourceDTO resourceDTO) {
        Resource resource = convertToEntity(resourceDTO);
        Resource updatedResource = resourceService.updateResource(id, resource);
        return ResponseEntity.ok(convertToDTO(updatedResource));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ResourceDTO>> getResourcesByType(@PathVariable ResourceType type) {
        List<ResourceDTO> dtos = resourceService.getResourcesByType(type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/available")
    public ResponseEntity<List<ResourceDTO>> getAvailableResources() {
        List<ResourceDTO> dtos = resourceService.getAvailableResources().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ResourceDTO>> searchResources(@RequestParam String name) {
        List<ResourceDTO> dtos = resourceService.searchResourcesByName(name).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<Boolean> checkResourceAvailability(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(resourceService.isResourceAvailable(id, quantity));
    }

    @PatchMapping("/{id}/quantity")
    public ResponseEntity<ResourceDTO> updateResourceQuantity(
            @PathVariable Long id,
            @RequestParam Integer quantity) {
        Resource resource = resourceService.updateResourceQuantity(id, quantity);
        return ResponseEntity.ok(convertToDTO(resource));
    }

    // ============ METHODES DE CONVERSION ============

    private ResourceDTO convertToDTO(Resource resource) {
        ResourceDTO dto = new ResourceDTO();
        dto.setId(resource.getId());
        dto.setName(resource.getName());
        dto.setDescription(resource.getDescription());
        dto.setType(resource.getType());
        dto.setTotalQuantity(resource.getTotalQuantity());
        dto.setReusable(resource.getReusable());
        dto.setLocation(resource.getLocation());
        return dto;
    }

    private Resource convertToEntity(ResourceDTO dto) {
        Resource resource = new Resource();
        resource.setId(dto.getId());
        resource.setName(dto.getName());
        resource.setDescription(dto.getDescription());
        resource.setType(dto.getType());
        resource.setTotalQuantity(dto.getTotalQuantity());
        resource.setReusable(dto.getReusable());
        resource.setLocation(dto.getLocation());
        return resource;
    }
}