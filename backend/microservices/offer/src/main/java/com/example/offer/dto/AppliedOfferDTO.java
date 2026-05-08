package com.example.offer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppliedOfferDTO {
    private Double originalPrice;
    private Double finalPrice;
    private Double totalDiscount;
    private Double discountPercentage;
    private Boolean success;
    private List<String> messages;
    private List<AppliedOfferDetail> appliedOffers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppliedOfferDetail {
        private String offerId;
        private String offerName;
        private String offerType;
        private Double discountValue;
        private String description;
    }
}