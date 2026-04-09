package com.esprit.microservice.library.service;

import com.esprit.microservice.library.dto.ProductDTO;
import com.esprit.microservice.library.dto.StockMovementDTO;

import java.util.List;

public interface StockMovementService {

    ProductDTO addStock(Long productId, Integer quantity, String reason);

    ProductDTO removeStock(Long productId, Integer quantity, String reason);

    List<StockMovementDTO> getMovementsByProductId(Long productId);
}

