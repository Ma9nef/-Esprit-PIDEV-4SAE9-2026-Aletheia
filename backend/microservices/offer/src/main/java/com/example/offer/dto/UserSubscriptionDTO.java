package com.example.offer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSubscriptionDTO {
    private boolean hasActiveSubscription;
    private String subscriptionId;
    private String planName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer daysRemaining;
    private Integer coursesUsed;
    private Integer coursesLimit;
    private Boolean canGetCertification;

    public UserSubscriptionDTO(boolean hasActiveSubscription) {
        this.hasActiveSubscription = hasActiveSubscription;
    }
}