package com.esprit.microservice.resourcemanagement.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * Minimal projection of an Event received from the Event microservice via Feign.
 */
@Data
public class EventSummaryDto {
    private Long id;
    private String title;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String organizer;
}
