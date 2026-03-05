package com.esprit.microservice.library.mapper;

import com.esprit.microservice.library.dto.StockMovementDTO;
import com.esprit.microservice.library.entity.StockMovement;
import org.springframework.stereotype.Component;

@Component
public class StockMovementMapper {

    public StockMovementDTO toDTO(StockMovement movement) {
        if (movement == null) return null;

        StockMovementDTO dto = new StockMovementDTO();
        dto.setId(movement.getId());
        dto.setProductId(movement.getProduct().getId());
        dto.setProductTitle(movement.getProduct().getTitle());
        dto.setMovementType(movement.getMovementType());
        dto.setQuantity(movement.getQuantity());
        dto.setReason(movement.getReason());
        dto.setTimestamp(movement.getTimestamp());

        return dto;
    }
}

