package tn.esprit.microservice.aletheia.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.microservice.aletheia.DTO.EventResourceAllocationDTO;
import tn.esprit.microservice.aletheia.entity.EventResourceAllocation;
import tn.esprit.microservice.aletheia.service.EventResourceAllocationService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/allocations")
@RequiredArgsConstructor
@CrossOrigin("*")
public class EventResourceAllocationController {

    private final EventResourceAllocationService allocationService;

    // GET ALL - AJOUTER CETTE MÉTHODE
   /* @GetMapping
    public ResponseEntity<List<EventResourceAllocation>> getAllAllocations() {
        List<EventResourceAllocation> allocations = allocationService.getAllAllocations();
        return ResponseEntity.ok(allocations);
    }*/

    @PostMapping
    public ResponseEntity<EventResourceAllocation> allocateResource(
            @RequestBody EventResourceAllocation allocation) {
        EventResourceAllocation created = allocationService.allocateResource(allocation);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResourceAllocation> getAllocationById(@PathVariable Long id) {
        return ResponseEntity.ok(allocationService.getAllocationById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventResourceAllocation> updateAllocation(
            @PathVariable Long id,
            @RequestBody EventResourceAllocation allocation) {
        return ResponseEntity.ok(allocationService.updateAllocation(id, allocation));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAllocation(@PathVariable Long id) {
        allocationService.deleteAllocation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<EventResourceAllocation>> getAllocationsByEvent(
            @PathVariable Long eventId) {
        return ResponseEntity.ok(allocationService.getAllocationsByEvent(eventId));
    }

    @GetMapping("/resource/{resourceId}")
    public ResponseEntity<List<EventResourceAllocation>> getAllocationsByResource(
            @PathVariable Long resourceId) {
        return ResponseEntity.ok(allocationService.getAllocationsByResource(resourceId));
    }

    @PostMapping("/check-availability")
    public ResponseEntity<Boolean> checkAvailability(
            @RequestBody EventResourceAllocation allocation) {
        return ResponseEntity.ok(allocationService.checkResourceAvailability(allocation));
    }

    @GetMapping("/resource/{resourceId}/conflicts")
    public ResponseEntity<List<EventResourceAllocation>> getConflictingAllocations(
            @PathVariable Long resourceId,
            @RequestParam(required = false) Long eventId,
            @RequestBody EventResourceAllocation allocation) {
        return ResponseEntity.ok(allocationService.getConflictingAllocations(resourceId, eventId, allocation));
    }

    @GetMapping("/resource/{resourceId}/usage")
    public ResponseEntity<Integer> getTotalResourceUsage(@PathVariable Long resourceId) {
        return ResponseEntity.ok(allocationService.getTotalResourceUsage(resourceId));
    }









    // tn.esprit.microservice.aletheia.controller.EventResourceAllocationController

    @GetMapping
    public ResponseEntity<List<EventResourceAllocationDTO>> getAllAllocations() {
        List<EventResourceAllocation> allocations = allocationService.getAllAllocations();

        // Convertir en DTOs
        List<EventResourceAllocationDTO> dtos = allocations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private EventResourceAllocationDTO convertToDTO(EventResourceAllocation entity) {
        EventResourceAllocationDTO dto = new EventResourceAllocationDTO();
        dto.setId(entity.getId());
        dto.setQuantityUsed(entity.getQuantityUsed());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setNotes(entity.getNotes());

        // Informations de l'événement
        if (entity.getEvent() != null) {
            dto.setEventId(entity.getEvent().getId());
            dto.setEventTitle(entity.getEvent().getTitle());
            dto.setEventLocation(entity.getEvent().getLocation());
            dto.setEventStatus(entity.getEvent().getStatus().toString());
            dto.setEventStartDate(entity.getEvent().getStartDate());
            dto.setEventEndDate(entity.getEvent().getEndDate());
        }

        // Informations de la ressource
        if (entity.getResource() != null) {
            dto.setResourceId(entity.getResource().getId());
            dto.setResourceName(entity.getResource().getName());
            dto.setResourceType(entity.getResource().getType().toString());
            dto.setResourceLocation(entity.getResource().getLocation());
            dto.setResourceTotalQuantity(entity.getResource().getTotalQuantity());
            dto.setResourceReusable(entity.getResource().getReusable());
        }

        return dto;
    }
}