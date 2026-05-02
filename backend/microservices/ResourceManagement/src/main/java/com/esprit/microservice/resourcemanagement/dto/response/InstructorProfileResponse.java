package com.esprit.microservice.resourcemanagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class InstructorProfileResponse {
    private String instructorId;
    private Integer reputationScore;
    private Integer totalReservations;
    private Integer noShowCount;
    private Integer lateCancellationCount;
    private Boolean isTrusted;
    private LocalDateTime lastUpdated;
}
