package com.esprit.microservice.library.controller;

import com.esprit.microservice.library.dto.ProductDTO;
import com.esprit.microservice.library.dto.StockAdjustmentRequest;
import com.esprit.microservice.library.dto.StockMovementDTO;
import com.esprit.microservice.library.service.StockMovementService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/stock")
@CrossOrigin(origins = "http://localhost:4200")
public class StockMovementController {

    private final StockMovementService stockMovementService;

    public StockMovementController(StockMovementService stockMovementService) {
        this.stockMovementService = stockMovementService;
    }

    /**
     * POST /api/products/{productId}/stock/add
     * Add stock to a product
     */
    @PostMapping("/add")
    public ResponseEntity<ProductDTO> addStock(
            @PathVariable Long productId,
            @Valid @RequestBody StockAdjustmentRequest request) {
        ProductDTO updated = stockMovementService.addStock(
                productId, request.getQuantity(), request.getReason());
        return ResponseEntity.ok(updated);
    }

    /**
     * POST /api/products/{productId}/stock/remove
     * Remove stock from a product
     */
    @PostMapping("/remove")
    public ResponseEntity<ProductDTO> removeStock(
            @PathVariable Long productId,
            @Valid @RequestBody StockAdjustmentRequest request) {
        ProductDTO updated = stockMovementService.removeStock(
                productId, request.getQuantity(), request.getReason());
        return ResponseEntity.ok(updated);
    }

    /**
     * GET /api/products/{productId}/stock/movements
     * Get stock movement history for a product
     */
    @GetMapping("/movements")
    public ResponseEntity<List<StockMovementDTO>> getMovements(@PathVariable Long productId) {
        return ResponseEntity.ok(stockMovementService.getMovementsByProductId(productId));
    }
}

