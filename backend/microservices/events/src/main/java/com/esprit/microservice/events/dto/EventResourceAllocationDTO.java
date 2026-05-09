package com.esprit.microservice.events.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventResourceAllocationDTO {
    private Long id;
    private Long eventId;
    private String eventTitle;
    private Long resourceId;
    private String resourceName;
    private Integer quantityUsed;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String notes;
}/*package com.esprit.microservice.events.dto;

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
}*/