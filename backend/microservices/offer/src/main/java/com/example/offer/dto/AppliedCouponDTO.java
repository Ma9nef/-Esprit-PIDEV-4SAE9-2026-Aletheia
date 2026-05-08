package com.example.offer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppliedCouponDTO {
    private boolean success;
    private String message;
    private String couponCode;
    private Double originalPrice;
    private Double finalPrice;
    private Double discountAmount;

    public AppliedCouponDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
}