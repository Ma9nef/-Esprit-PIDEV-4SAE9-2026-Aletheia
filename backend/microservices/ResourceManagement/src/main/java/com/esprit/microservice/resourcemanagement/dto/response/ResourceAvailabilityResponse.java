package com.esprit.microservice.resourcemanagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ResourceAvailabilityResponse {
    private Long id;
    private UUID resourceId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;
}
