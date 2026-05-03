package com.esprit.microservice.library.dto;

import com.esprit.microservice.library.enums.ProductType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopProductDTO {
    private Long productId;
    private String title;
    private String author;
    private ProductType type;
    private long borrowCount;
    private int currentStock;
}
