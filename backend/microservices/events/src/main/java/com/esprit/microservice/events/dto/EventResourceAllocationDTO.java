package com.esprit.microservice.events.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventResourceAllocationDTO {
    private Long id;
    private Integer quantityUsed;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String notes;

    // Event information
    private Long eventId;
    private String eventTitle;
    private String eventLocation;
    private String eventStatus;
    private LocalDateTime eventStartDate;
    private LocalDateTime eventEndDate;

    // Resource information
    private Long resourceId;
    private String resourceName;
    private String resourceType;
    private String resourceLocation;
    private Integer resourceTotalQuantity;
    private Boolean resourceReusable;
}