package com.esprit.microservice.resourcemanagement.dto.response;

import com.esprit.microservice.resourcemanagement.entity.enums.WaitlistStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
public class WaitlistEntryResponse {
    private UUID id;
    private UUID resourceId;
    private String instructorId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer position;
    private WaitlistStatus status;
    private LocalDateTime notifiedAt;
    private LocalDateTime createdAt;
}
