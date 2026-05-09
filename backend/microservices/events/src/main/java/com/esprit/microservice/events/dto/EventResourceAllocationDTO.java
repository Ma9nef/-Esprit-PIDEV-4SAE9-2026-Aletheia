package com.esprit.microservice.events.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
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
    private String status;
}