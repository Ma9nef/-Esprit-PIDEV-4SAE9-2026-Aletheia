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
    private String planName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;

    public SubscriptionResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}