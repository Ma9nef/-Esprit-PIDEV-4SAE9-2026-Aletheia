package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.request.CreateMaintenanceWindowRequest;
import com.esprit.microservice.resourcemanagement.dto.response.MaintenanceWindowResponse;
import com.esprit.microservice.resourcemanagement.entity.MaintenanceWindow;
import com.esprit.microservice.resourcemanagement.entity.Resource;
import com.esprit.microservice.resourcemanagement.repository.MaintenanceWindowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MaintenanceWindowService {

    private final MaintenanceWindowRepository maintenanceWindowRepository;
    private final ResourceService resourceService;

    @Transactional(readOnly = true)
    public List<MaintenanceWindowResponse> listForResource(UUID resourceId) {
        resourceService.findOrThrow(resourceId); // validate resource exists
        return maintenanceWindowRepository.findByResourceIdOrderByStartTimeAsc(resourceId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MaintenanceWindowResponse create(CreateMaintenanceWindowRequest req, String adminId) {
        Resource resource = resourceService.findOrThrow(req.getResourceId());

        if (!req.getEndTime().isAfter(req.getStartTime())) {
            throw new IllegalArgumentException("endTime must be after startTime");
        }

        MaintenanceWindow window = MaintenanceWindow.builder()
                .resourceId(resource.getId())
                .title(req.getTitle())
                .startTime(req.getStartTime())
                .endTime(req.getEndTime())
                .notes(req.getNotes())
                .createdBy(adminId)
                .build();

        return toResponse(maintenanceWindowRepository.save(window));
    }

    public void delete(UUID windowId) {
        maintenanceWindowRepository.findById(windowId)
                .orElseThrow(() -> new NoSuchElementException("Maintenance window not found: " + windowId));
        maintenanceWindowRepository.deleteById(windowId);
    }

    /** Called by ReservationService to check for maintenance conflicts. */
    @Transactional(readOnly = true)
    public boolean hasMaintenanceConflict(UUID resourceId, LocalDateTime start, LocalDateTime end) {
        return !maintenanceWindowRepository.findOverlapping(resourceId, start, end).isEmpty();
    }

    // ── helpers ───────────────────────────────────────────────────────────

    private MaintenanceWindowResponse toResponse(MaintenanceWindow m) {
        return MaintenanceWindowResponse.builder()
                .id(m.getId())
                .resourceId(m.getResourceId())
                .title(m.getTitle())
                .startTime(m.getStartTime())
                .endTime(m.getEndTime())
                .notes(m.getNotes())
                .createdBy(m.getCreatedBy())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
