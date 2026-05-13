package com.example.offer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlanResponseDTO {
    private boolean success;
    private String message;
    private String planId;
    private String name;
    private String description;
    private Double price;
    private Integer durationDays;
    private Integer maxCourses;
    private Boolean certificationIncluded;
    private Boolean isActive;

    public SubscriptionPlanResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}