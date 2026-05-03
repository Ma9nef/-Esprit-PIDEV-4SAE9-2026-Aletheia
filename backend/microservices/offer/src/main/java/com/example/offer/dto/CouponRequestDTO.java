package com.example.offer.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CouponRequestDTO {

    private String code;
    private String offerId;
    private String description;

    // Type de coupon
    private Boolean isUnique;        // true = usage unique / false = partagé

    // Si coupon personnel
    private String assignedUserId;

    // Restrictions
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;

    private Integer maxUses;         // Nombre maximum d'utilisations
}
