package com.esprit.microservice.resourcemanagement.dto.response;

import com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
public class ReservationResponse {
    private UUID id;
    private UUID resourceId;
    private String resourceName;
    private String resourceLocation;
    private UUID teachingSessionId;
    private String sessionTitle;
    private String courseCode;
    private String instructorId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private ReservationStatus status;
    private UUID recurrenceGroupId;
    private String qrCodeToken;
    private LocalDateTime checkedInAt;
    private Boolean noShow;
    private String rejectionReason;
    private String cancellationReason;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
