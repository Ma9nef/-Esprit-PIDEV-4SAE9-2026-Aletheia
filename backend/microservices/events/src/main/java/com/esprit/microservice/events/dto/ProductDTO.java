package com.esprit.microservice.events.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String title;
    private String author;
    private String description;
    private Double price;
    private String type;
    private Boolean available;
    private Integer stockQuantity;
    private String coverImageUrl;
    private String fileUrl;
    private Boolean lowStock;
    private Integer stockThreshold;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}