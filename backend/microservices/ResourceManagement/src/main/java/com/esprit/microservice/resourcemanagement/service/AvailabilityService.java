package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.request.CheckAvailabilityRequest;
import com.esprit.microservice.resourcemanagement.dto.response.AvailabilityResponse;
import com.esprit.microservice.resourcemanagement.dto.response.ResourceResponse;
import com.esprit.microservice.resourcemanagement.entity.Resource;
import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import com.esprit.microservice.resourcemanagement.repository.MaintenanceWindowRepository;
import com.esprit.microservice.resourcemanagement.repository.ReservationRepository;
import com.esprit.microservice.resourcemanagement.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AvailabilityService {

    private final ResourceRepository resourceRepository;
    private final ReservationRepository reservationRepository;
    private final MaintenanceWindowRepository maintenanceWindowRepository;
    private final ResourceService resourceService;

    /**
     * Check if a specific resource is available, or if type is given browse
     * all matching free resources.
     */
    public AvailabilityResponse check(CheckAvailabilityRequest req) {
        LocalDateTime start = req.getStartTime();
        LocalDateTime end   = req.getEndTime();

        if (req.getResourceId() != null) {
            return checkSingleResource(req.getResourceId(), start, end);
        }

        // browse free resources of given type
        List<Resource> freeResources = resourceRepository.findAvailableResources(
                req.getType(), req.getMinCapacity(), null, start, end);

        List<ResourceResponse> responses = freeResources.stream()
                .map(resourceService::toResponse)
                .collect(Collectors.toList());

        return AvailabilityResponse.builder()
                .available(!responses.isEmpty())
                .availableResources(responses)
                .build();
    }

    /**
     * Smart suggest: when a slot is unavailable, return top-3 alternative resources
     * scored by location proximity + conditionScore + (1 - utilizationRate).
     */
    public AvailabilityResponse suggest(UUID resourceId, LocalDateTime start,
                                        LocalDateTime end, Integer expectedAttendees) {
        Resource target = resourceService.findOrThrow(resourceId);

        // First check if the resource itself is free
        AvailabilityResponse direct = checkSingleResource(resourceId, start, end);
        if (direct.isAvailable()) {
            return direct;
        }

        // Get alternatives of same type
        List<Resource> alternatives = resourceRepository.findAlternatives(
                target.getType(), expectedAttendees, start, end);

        List<AvailabilityResponse.AlternativeSuggestion> suggestions = alternatives.stream()
                .limit(3)
                .map(alt -> scoreSuggestion(alt, target, start, end))
                .sorted(Comparator.comparingDouble(AvailabilityResponse.AlternativeSuggestion::getScore).reversed())
                .collect(Collectors.toList());

        return AvailabilityResponse.builder()
                .available(false)
                .nextFreeWindow(findNextFreeWindow(resourceId, end))
                .suggestions(suggestions)
                .build();
    }

    /**
     * Browse free slots of a given resource type on a specific date.
     */
    public List<ResourceResponse> browse(ResourceType type, LocalDate date,
                                          Integer minCapacity) {
        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd   = date.atTime(23, 59, 59);

        return resourceRepository.findAvailableResources(type, minCapacity, null, dayStart, dayEnd)
                .stream()
                .map(resourceService::toResponse)
                .collect(Collectors.toList());
    }

    // ── private helpers ───────────────────────────────────────────────────

    private AvailabilityResponse checkSingleResource(UUID resourceId,
                                                     LocalDateTime start, LocalDateTime end) {
        boolean reservationConflict = !reservationRepository
                .findConflictingReservations(resourceId, start, end).isEmpty();
        boolean maintenanceConflict = !maintenanceWindowRepository
                .findOverlapping(resourceId, start, end).isEmpty();

        boolean available = !reservationConflict && !maintenanceConflict;

        LocalDateTime nextFree = available ? null : findNextFreeWindow(resourceId, end);

        return AvailabilityResponse.builder()
                .available(available)
                .nextFreeWindow(nextFree)
                .build();
    }

    /**
     * Naive next-free-window: scan forward in 1-hour increments for up to 7 days.
     */
    private LocalDateTime findNextFreeWindow(UUID resourceId, LocalDateTime searchFrom) {
        LocalDateTime cursor = searchFrom.plusMinutes(30);
        LocalDateTime limit  = searchFrom.plusDays(7);
        long durationMinutes = 60; // look for at least a 1-hour free slot

        while (cursor.isBefore(limit)) {
            LocalDateTime candidateEnd = cursor.plusMinutes(durationMinutes);
            boolean conflict = !reservationRepository
                    .findConflictingReservations(resourceId, cursor, candidateEnd).isEmpty()
                    || !maintenanceWindowRepository
                    .findOverlapping(resourceId, cursor, candidateEnd).isEmpty();
            if (!conflict) return cursor;
            cursor = cursor.plusMinutes(30);
        }
        return null;
    }

    private AvailabilityResponse.AlternativeSuggestion scoreSuggestion(
            Resource alt, Resource target, LocalDateTime start, LocalDateTime end) {

        double score = 0;

        // Location proximity: same building prefix adds 2 points
        if (target.getLocation() != null && alt.getLocation() != null) {
            String targetBuilding = target.getLocation().split(",")[0].trim();
            if (alt.getLocation().startsWith(targetBuilding)) score += 2;
        }

        // Condition score (1-5 → 0-5 points)
        if (alt.getConditionScore() != null) score += alt.getConditionScore();

        // Utilization penalty: higher utilization = lower score (simplified: fixed +1 for available)
        score += 1;

        String reason = buildReason(alt, target);

        return AvailabilityResponse.AlternativeSuggestion.builder()
                .resource(resourceService.toResponse(alt))
                .reason(reason)
                .score(score)
                .build();
    }

    private String buildReason(Resource alt, Resource target) {
        List<String> parts = new ArrayList<>();
        if (target.getLocation() != null && alt.getLocation() != null &&
                alt.getLocation().startsWith(target.getLocation().split(",")[0].trim())) {
            parts.add("same building");
        }
        if (alt.getConditionScore() != null && alt.getConditionScore() >= 4) {
            parts.add("excellent condition");
        }
        if (alt.getCapacity() != null && target.getCapacity() != null &&
                alt.getCapacity() >= target.getCapacity()) {
            parts.add("adequate capacity");
        }
        return parts.isEmpty() ? "available alternative" : String.join(", ", parts);
    }
}
