package com.esprit.microservice.resourcemanagement.dto.response;

import com.esprit.microservice.resourcemanagement.entity.enums.SwapRequestStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data @Builder
public class SwapRequestResponse {
    private UUID id;
    private String requesterId;
    private String targetId;
    private UUID requesterReservationId;
    private UUID targetReservationId;
    private SwapRequestStatus status;
    private String requesterNote;
    private String responseNote;
    private LocalDateTime expiresAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
}
