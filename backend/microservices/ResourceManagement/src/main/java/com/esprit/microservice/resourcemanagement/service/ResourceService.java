package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.dto.request.CreateResourceRequest;
import com.esprit.microservice.resourcemanagement.dto.request.UpdateResourceRequest;
import com.esprit.microservice.resourcemanagement.dto.response.ResourceResponse;
import com.esprit.microservice.resourcemanagement.entity.Resource;
import com.esprit.microservice.resourcemanagement.entity.enums.MaintenanceStatus;
import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import com.esprit.microservice.resourcemanagement.exception.ResourceNotFoundException;
import com.esprit.microservice.resourcemanagement.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ResourceService {

    private static final Set<ResourceType> APPROVAL_REQUIRED_TYPES =
            Set.of(ResourceType.CLASSROOM, ResourceType.COMPUTER_LAB, ResourceType.AMPHITHEATER);

    private final ResourceRepository resourceRepository;
    private final KafkaEventPublisher kafkaEventPublisher;

    // ── queries ───────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<ResourceResponse> listAll() {
        return resourceRepository.findByDeletedFalse().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResourceResponse getById(UUID id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<ResourceResponse> search(ResourceType type, String location, Integer minCapacity) {
        return resourceRepository.findByDeletedFalse().stream()
                .filter(r -> type == null || r.getType() == type)
                .filter(r -> location == null || (r.getLocation() != null &&
                        r.getLocation().toLowerCase().contains(location.toLowerCase())))
                .filter(r -> minCapacity == null || (r.getCapacity() != null &&
                        r.getCapacity() >= minCapacity))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── mutations ─────────────────────────────────────────────────────────

    public ResourceResponse create(CreateResourceRequest req) {
        boolean requiresApproval = req.getRequiresApproval() != null
                ? req.getRequiresApproval()
                : APPROVAL_REQUIRED_TYPES.contains(req.getType());

        Resource resource = Resource.builder()
                .name(req.getName())
                .type(req.getType())
                .capacity(req.getCapacity())
                .description(req.getDescription())
                .location(req.getLocation())
                .requiresApproval(requiresApproval)
                .conditionScore(req.getConditionScore() != null ? req.getConditionScore() : 5)
                .maintenanceStatus(MaintenanceStatus.OPERATIONAL)
                .maxReservationHours(req.getMaxReservationHours())
                .minAdvanceBookingHours(req.getMinAdvanceBookingHours())
                .deleted(false)
                .build();

        if (req.getAttributes() != null) {
            resource.setAttributes(req.getAttributes());
        }

        return toResponse(resourceRepository.save(resource));
    }

    public ResourceResponse update(UUID id, UpdateResourceRequest req) {
        Resource resource = findOrThrow(id);

        if (req.getName() != null)             resource.setName(req.getName());
        if (req.getCapacity() != null)         resource.setCapacity(req.getCapacity());
        if (req.getDescription() != null)      resource.setDescription(req.getDescription());
        if (req.getLocation() != null)         resource.setLocation(req.getLocation());
        if (req.getRequiresApproval() != null) resource.setRequiresApproval(req.getRequiresApproval());
        if (req.getMaxReservationHours() != null)  resource.setMaxReservationHours(req.getMaxReservationHours());
        if (req.getMinAdvanceBookingHours() != null) resource.setMinAdvanceBookingHours(req.getMinAdvanceBookingHours());
        if (req.getMaintenanceStatus() != null) resource.setMaintenanceStatus(req.getMaintenanceStatus());
        if (req.getAttributes() != null)       resource.setAttributes(req.getAttributes());

        return toResponse(resourceRepository.save(resource));
    }

    public void delete(UUID id) {
        Resource resource = findOrThrow(id);
        resource.setDeleted(true);
        resourceRepository.save(resource);
        log.info("Soft-deleted resource {}", id);
    }

    public ResourceResponse updateConditionScore(UUID id, int score) {
        if (score < 1 || score > 5) {
            throw new IllegalArgumentException("Condition score must be between 1 and 5");
        }
        Resource resource = findOrThrow(id);
        resource.setConditionScore(score);
        Resource saved = resourceRepository.save(resource);

        if (score <= 2) {
            kafkaEventPublisher.resourceConditionAlert(
                    id.toString(), resource.getName(), score);
        }

        return toResponse(saved);
    }

    // ── helpers ───────────────────────────────────────────────────────────

    public Resource findOrThrow(UUID id) {
        return resourceRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + id));
    }

    public ResourceResponse toResponse(Resource r) {
        return ResourceResponse.builder()
                .id(r.getId())
                .name(r.getName())
                .type(r.getType())
                .capacity(r.getCapacity())
                .description(r.getDescription())
                .location(r.getLocation())
                .requiresApproval(r.getRequiresApproval())
                .conditionScore(r.getConditionScore())
                .maintenanceStatus(r.getMaintenanceStatus())
                .maxReservationHours(r.getMaxReservationHours())
                .minAdvanceBookingHours(r.getMinAdvanceBookingHours())
                .attributes(r.getAttributes())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }
}
