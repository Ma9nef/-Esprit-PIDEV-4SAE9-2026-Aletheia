package com.esprit.microservice.resourcemanagement.mapper;

import com.esprit.microservice.resourcemanagement.dto.request.CreateReservationRequest;
import com.esprit.microservice.resourcemanagement.dto.response.ReservationResponse;
import com.esprit.microservice.resourcemanagement.entity.Reservation;
import com.esprit.microservice.resourcemanagement.entity.Resource;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

    public Reservation toEntity(CreateReservationRequest request) {
        return Reservation.builder()
                .resourceId(request.getResourceId())
                .eventId(request.getEventId())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();
    }

    public ReservationResponse toResponse(Reservation entity) {
        String resourceName = null;
        if (entity.getResource() != null) {
            resourceName = entity.getResource().getName();
        }

        return ReservationResponse.builder()
                .id(entity.getId())
                .resourceId(entity.getResourceId())
                .resourceName(resourceName)
                .eventId(entity.getEventId())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .status(entity.getStatus())
                .version(entity.getVersion())
                .createdBy(entity.getCreatedBy())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public ReservationResponse toResponseWithResourceName(Reservation entity, Resource resource) {
        return ReservationResponse.builder()
                .id(entity.getId())
                .resourceId(entity.getResourceId())
                .resourceName(resource != null ? resource.getName() : null)
                .eventId(entity.getEventId())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .status(entity.getStatus())
                .version(entity.getVersion())
                .createdBy(entity.getCreatedBy())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
