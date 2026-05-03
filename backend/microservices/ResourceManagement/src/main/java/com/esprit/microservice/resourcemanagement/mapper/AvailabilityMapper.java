package com.esprit.microservice.resourcemanagement.mapper;

import com.esprit.microservice.resourcemanagement.dto.request.CreateAvailabilityRequest;
import com.esprit.microservice.resourcemanagement.dto.response.ResourceAvailabilityResponse;
import com.esprit.microservice.resourcemanagement.entity.ResourceAvailability;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AvailabilityMapper {

    public ResourceAvailability toEntity(UUID resourceId, CreateAvailabilityRequest request) {
        return ResourceAvailability.builder()
                .resourceId(resourceId)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();
    }

    public ResourceAvailabilityResponse toResponse(ResourceAvailability entity) {
        return ResourceAvailabilityResponse.builder()
                .id(entity.getId())
                .resourceId(entity.getResourceId())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
