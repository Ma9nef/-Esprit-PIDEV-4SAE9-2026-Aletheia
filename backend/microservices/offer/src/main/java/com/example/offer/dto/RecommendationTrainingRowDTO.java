package com.example.offer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecommendationTrainingRowDTO {
    private String userId;
    private String labelPlanId;
    private String lastPlanId;
    private String mostRenewedPlanId;
    private Integer totalSubscriptions;
    private Integer renewalCount;
    private Integer cancelCount;
    private Integer expiredWithoutRenewalCount;
    private Integer successfulPaymentsCount;
    private Integer failedPaymentsCount;
    private Integer canceledPaymentsCount;
    private Double paymentSuccessRate;
    private Double averageDaysBetweenSubscriptions;
    private Boolean loyalCustomer;
    private Boolean fastCancellationProfile;
}
