package com.esprit.microservice.resourcemanagement.dto.response;

import com.esprit.microservice.resourcemanagement.entity.enums.MaintenanceStatus;
import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data @Builder
public class ResourceResponse {
    private UUID id;
    private String name;
    private ResourceType type;
    private Integer capacity;
    private String description;
    private String location;
    private Boolean requiresApproval;
    private Integer conditionScore;
    private MaintenanceStatus maintenanceStatus;
    private Integer maxReservationHours;
    private Integer minAdvanceBookingHours;
    private Map<String, Object> attributes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
