package com.example.offer.analytics;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "offer_history")
public class OfferHistory {

    @Id
    private String id;

    private String offerId;
    private String offerType; // Ceci correspond au type de l'offre (ex: PERCENTAGE, FIXED, etc.)

    private String instructorId;
    private String userId;

    private double originalPrice;
    private double discountAmount;
    private double finalPrice;

    private LocalDateTime purchaseDate;
}