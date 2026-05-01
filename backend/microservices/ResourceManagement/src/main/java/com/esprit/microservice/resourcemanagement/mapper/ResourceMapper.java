package com.esprit.microservice.resourcemanagement.mapper;

import com.esprit.microservice.resourcemanagement.dto.request.CreateResourceRequest;
import com.esprit.microservice.resourcemanagement.dto.response.ResourceResponse;
import com.esprit.microservice.resourcemanagement.entity.Resource;
import org.springframework.stereotype.Component;

@Component
public class ResourceMapper {

    public Resource toEntity(CreateResourceRequest request) {
        Resource resource = Resource.builder()
                .name(request.getName())
                .type(request.getType())
                .capacity(request.getCapacity())
                .description(request.getDescription())
                .location(request.getLocation())
                .requiresApproval(request.getRequiresApproval())
                .conditionScore(request.getConditionScore() != null ? request.getConditionScore() : 5)
                .maxReservationHours(request.getMaxReservationHours())
                .minAdvanceBookingHours(request.getMinAdvanceBookingHours())
                .build();

        if (request.getAttributes() != null && !request.getAttributes().isEmpty()) {
            resource.setAttributes(request.getAttributes());
        }

        return resource;
    }

    public ResourceResponse toResponse(Resource entity) {
        return ResourceResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .type(entity.getType())
                .capacity(entity.getCapacity())
                .description(entity.getDescription())
                .location(entity.getLocation())
                .requiresApproval(entity.getRequiresApproval())
                .conditionScore(entity.getConditionScore())
                .maintenanceStatus(entity.getMaintenanceStatus())
                .maxReservationHours(entity.getMaxReservationHours())
                .minAdvanceBookingHours(entity.getMinAdvanceBookingHours())
                .attributes(entity.getAttributes())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
