package com.example.offer.dto;

import lombok.Data;

@Data
public class RecommendationFeaturesDTO {
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
