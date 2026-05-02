package com.esprit.microservice.resourcemanagement.dto.request;

import com.esprit.microservice.resourcemanagement.entity.enums.MaintenanceStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.util.Map;

@Data
public class UpdateResourceRequest {

    private String name;
    private Integer capacity;
    private String description;
    private String location;
    private Boolean requiresApproval;
    private MaintenanceStatus maintenanceStatus;

    @Min(1) @Max(5)
    private Integer conditionScore;

    private Integer maxReservationHours;
    private Integer minAdvanceBookingHours;
    private Map<String, Object> attributes;
}
