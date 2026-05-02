package com.esprit.microservice.resourcemanagement.dto.request;

import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class CreateResourceRequest {

    @NotBlank
    private String name;

    @NotNull
    private ResourceType type;

    @Min(1)
    private Integer capacity;

    private String description;

    private String location;

    private Boolean requiresApproval;

    @Min(1) @Max(5)
    private Integer conditionScore = 5;

    private Integer maxReservationHours;

    private Integer minAdvanceBookingHours;

    private Map<String, Object> attributes;
}
