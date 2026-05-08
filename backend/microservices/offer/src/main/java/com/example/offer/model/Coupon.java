package com.example.offer.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Data
@Document(collection = "coupons")
public class Coupon {
    @Id
    private String id;

    @Indexed(unique = true)
    private String code;                // Code promo unique (ex: "BIENVENUE2024")

    private String offerId;             // Référence à l'offre associée
    private String description;

    // Type de coupon
    private Boolean isUnique;            // True = code unique à usage unique
    // False = code partagé utilisable plusieurs fois

    // Pour codes uniques
    private String assignedUserId;       // Utilisateur assigné (si code personnel)

    // Restrictions
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private Integer remainingUses;        // Pour codes partagés
    private Integer maxUses;               // Nombre maximum d'utilisations

    private OfferStatus status;
    private LocalDateTime createdAt;
}