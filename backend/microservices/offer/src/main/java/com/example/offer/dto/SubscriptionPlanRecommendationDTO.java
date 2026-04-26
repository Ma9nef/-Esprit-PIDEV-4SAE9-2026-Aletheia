package com.example.offer.dto;

import lombok.Data;

import java.util.List;

@Data
public class SubscriptionPlanRecommendationDTO {
    private boolean success;
    private String message;
    private String userId;
    private String recommendedPlanId;
    private String recommendedPlanName;
    private Double recommendedPlanPrice;
    private Integer confidenceScore;
    private String recommendationType;
    private List<String> reasons;
    private RecommendationFeaturesDTO features;
}
