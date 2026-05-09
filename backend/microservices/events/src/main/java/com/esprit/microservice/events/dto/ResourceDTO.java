package com.esprit.microservice.events.dto;

import com.esprit.microservice.events.entity.ResourceType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDTO {
    private Long id;
    private String name;
    private String description;
    private ResourceType type;
    private Integer totalQuantity;
    private Boolean reusable;
    private String location;
}