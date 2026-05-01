package com.esprit.microservice.resourcemanagement.mapper;

import com.esprit.microservice.resourcemanagement.dto.response.ReservationResponse;
import com.esprit.microservice.resourcemanagement.entity.Reservation;
import com.esprit.microservice.resourcemanagement.entity.Resource;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

    public ReservationResponse toResponse(Reservation entity) {
        return ReservationResponse.builder()
                .id(entity.getId())
                .resourceId(entity.getResource() != null ? entity.getResource().getId() : null)
                .resourceName(entity.getResource() != null ? entity.getResource().getName() : null)
                .resourceLocation(entity.getResource() != null ? entity.getResource().getLocation() : null)
                .teachingSessionId(entity.getTeachingSession() != null ? entity.getTeachingSession().getId() : null)
                .sessionTitle(entity.getTeachingSession() != null ? entity.getTeachingSession().getTitle() : null)
                .courseCode(entity.getTeachingSession() != null ? entity.getTeachingSession().getCourseCode() : null)
                .instructorId(entity.getInstructorId())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .status(entity.getStatus())
                .recurrenceGroupId(entity.getRecurrenceGroupId())
                .qrCodeToken(entity.getQrCodeToken())
                .checkedInAt(entity.getCheckedInAt())
                .noShow(entity.getNoShow())
                .rejectionReason(entity.getRejectionReason())
                .cancellationReason(entity.getCancellationReason())
                .expiresAt(entity.getExpiresAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public ReservationResponse toResponseWithResourceName(Reservation entity, Resource resource) {
        Resource r = resource != null ? resource : entity.getResource();
        return ReservationResponse.builder()
                .id(entity.getId())
                .resourceId(r != null ? r.getId() : null)
                .resourceName(r != null ? r.getName() : null)
                .resourceLocation(r != null ? r.getLocation() : null)
                .teachingSessionId(entity.getTeachingSession() != null ? entity.getTeachingSession().getId() : null)
                .sessionTitle(entity.getTeachingSession() != null ? entity.getTeachingSession().getTitle() : null)
                .courseCode(entity.getTeachingSession() != null ? entity.getTeachingSession().getCourseCode() : null)
                .instructorId(entity.getInstructorId())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .status(entity.getStatus())
                .recurrenceGroupId(entity.getRecurrenceGroupId())
                .qrCodeToken(entity.getQrCodeToken())
                .checkedInAt(entity.getCheckedInAt())
                .noShow(entity.getNoShow())
                .rejectionReason(entity.getRejectionReason())
                .cancellationReason(entity.getCancellationReason())
                .expiresAt(entity.getExpiresAt())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
