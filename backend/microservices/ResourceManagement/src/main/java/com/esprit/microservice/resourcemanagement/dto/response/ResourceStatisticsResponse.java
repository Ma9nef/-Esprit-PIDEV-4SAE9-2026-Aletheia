package com.esprit.microservice.resourcemanagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data @Builder
public class ResourceStatisticsResponse {
    private UUID resourceId;
    private String resourceName;
    private long totalReservations;
    private long confirmedReservations;
    private long cancelledReservations;
    private long pendingReservations;
    private double utilizationPercentage;
    private double averageReservationDurationHours;
    private long totalReservationHours;
    private Map<String, Long> reservationsByDayOfWeek;
    private Map<String, Long> peakHours;
    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;
}
