package com.esprit.microservice.resourcemanagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
public class MaintenanceWindowResponse {
    private UUID id;
    private UUID resourceId;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String notes;
    private String createdBy;
    private LocalDateTime createdAt;
}
