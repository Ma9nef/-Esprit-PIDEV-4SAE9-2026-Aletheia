package com.esprit.microservice.library.dto;

import com.esprit.microservice.library.enums.ProductType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryInsightDTO {

    public enum InsightType {
        INCREASE_COPIES,
        CONSIDER_REMOVAL
    }

    private Long productId;
    private String title;
    private ProductType type;
    private InsightType insightType;
    private String reason;
    private long borrowCount;
    private int currentStock;
}
