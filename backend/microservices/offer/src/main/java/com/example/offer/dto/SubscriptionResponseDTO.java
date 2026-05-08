package com.example.offer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponseDTO {
    private boolean success;
    private String message;
    private String subscriptionId;
    private String subscriptionNumber;
    private String userId;
    private String planId;
    private String planName;
    private String planDescription;
    private Double planPrice;
    private Integer durationDays;
    private Integer maxCourses;
    private Boolean certificationIncluded;
    private Boolean planActive;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private Integer daysRemaining;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SubscriptionResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}