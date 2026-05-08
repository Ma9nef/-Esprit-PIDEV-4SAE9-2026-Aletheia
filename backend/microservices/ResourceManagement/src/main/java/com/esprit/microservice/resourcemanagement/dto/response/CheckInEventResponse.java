package com.esprit.microservice.resourcemanagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
public class CheckInEventResponse {
    private UUID id;
    private UUID reservationId;
    private LocalDateTime scannedAt;
    private String tokenUsed;
    private Boolean valid;
    private LocalDateTime createdAt;
}
