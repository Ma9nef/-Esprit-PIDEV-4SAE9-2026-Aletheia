package com.esprit.microservice.resourcemanagement.dto.request;

import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CheckAvailabilityRequest {

    private UUID resourceId;
    private ResourceType type;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;

    private Integer minCapacity;
}
