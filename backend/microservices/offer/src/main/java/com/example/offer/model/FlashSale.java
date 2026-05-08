package com.example.offer.model;



import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "flash_sales")
public class FlashSale {
    @Id
    private String id;

    private String name;
    private String description;
    private String offerId;              // Référence à l'offre

    // Période très courte
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // 🔥 Limitation par nombre d’utilisateurs
    private Integer maxUsers;        // Nombre maximum d'utilisateurs autorisés
    private Integer currentUsers;    // Nombre d'utilisateurs ayant déjà utilisé l'offre

    private Boolean isActive;


}