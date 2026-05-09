package com.esprit.microservice.events.controller;

import com.esprit.microservice.events.dto.EventResourceAllocationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.esprit.microservice.events.entity.EventResourceAllocation;
import com.esprit.microservice.events.service.EventResourceAllocationService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/allocations")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EventResourceAllocationController {

    private final EventResourceAllocationService allocationService;

    @GetMapping
    public ResponseEntity<List<EventResourceAllocationDTO>> getAllAllocations() {
        List<EventResourceAllocation> allocations = allocationService.getAllAllocations();
        List<EventResourceAllocationDTO> dtos = allocations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<EventResourceAllocationDTO> allocateResource(
            @RequestBody EventResourceAllocationDTO allocationDTO) {
        EventResourceAllocation allocation = convertToEntity(allocationDTO);
        EventResourceAllocation created = allocationService.allocateResource(allocation);
        return new ResponseEntity<>(convertToDTO(created), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResourceAllocationDTO> getAllocationById(@PathVariable Long id) {
        EventResourceAllocation allocation = allocationService.getAllocationById(id);
        return ResponseEntity.ok(convertToDTO(allocation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResourceAllocationDTO> updateAllocation(
            @PathVariable Long id,
            @RequestBody EventResourceAllocationDTO allocationDTO) {
        EventResourceAllocation allocation = convertToEntity(allocationDTO);
        EventResourceAllocation updated = allocationService.updateAllocation(id, allocation);
        return ResponseEntity.ok(convertToDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAllocation(@PathVariable Long id) {
        allocationService.deleteAllocation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventResourceAllocationDTO>> getAllocationsByEvent(
            @PathVariable Long eventId) {
        List<EventResourceAllocation> allocations = allocationService.getAllocationsByEvent(eventId);
        List<EventResourceAllocationDTO> dtos = allocations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/resource/{resourceId}")
    public ResponseEntity<List<EventResourceAllocationDTO>> getAllocationsByResource(
            @PathVariable Long resourceId) {
        List<EventResourceAllocation> allocations = allocationService.getAllocationsByResource(resourceId);
        List<EventResourceAllocationDTO> dtos = allocations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/resource/{resourceId}/usage")
    public ResponseEntity<Integer> getTotalResourceUsage(@PathVariable Long resourceId) {
        return ResponseEntity.ok(allocationService.getTotalResourceUsage(resourceId));
    }

    // ============ METHODES DE CONVERSION ============

    private EventResourceAllocationDTO convertToDTO(EventResourceAllocation entity) {
        EventResourceAllocationDTO dto = new EventResourceAllocationDTO();
        dto.setId(entity.getId());
        dto.setQuantityUsed(entity.getQuantityUsed());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setNotes(entity.getNotes());

        if (entity.getEvent() != null) {
            dto.setEventId(entity.getEvent().getId());
            dto.setEventTitle(entity.getEvent().getTitle());
        }

        if (entity.getResource() != null) {
            dto.setResourceId(entity.getResource().getId());
            dto.setResourceName(entity.getResource().getName());
        }

        return dto;
    }

    private EventResourceAllocation convertToEntity(EventResourceAllocationDTO dto) {
        EventResourceAllocation entity = new EventResourceAllocation();
        entity.setId(dto.getId());
        entity.setQuantityUsed(dto.getQuantityUsed());
        entity.setStartTime(dto.getStartTime());
        entity.setEndTime(dto.getEndTime());
        entity.setNotes(dto.getNotes());
        return entity;
    }
}