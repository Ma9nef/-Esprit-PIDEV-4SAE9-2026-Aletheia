package com.example.offer.controller;

import com.example.offer.model.FlashSale;
import com.example.offer.service.FlashSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flash-sales")
@RequiredArgsConstructor
public class FlashSaleController {

    private final FlashSaleService flashSaleService;

    // Créer une FlashSale
    @PostMapping
    public ResponseEntity<FlashSale> createFlashSale(@RequestBody FlashSale flashSale) {
        FlashSale saved = flashSaleService.createFlashSale(flashSale);
        return ResponseEntity.ok(saved);
    }

    // Lister toutes les FlashSales actives
    @GetMapping("/active")
    public ResponseEntity<List<FlashSale>> getActiveFlashSales() {
        return ResponseEntity.ok(flashSaleService.getActiveFlashSales());
    }

    // Appliquer une FlashSale à un utilisateur
    @PostMapping("/{flashSaleId}/apply")
    public ResponseEntity<String> applyFlashSale(
            @PathVariable String flashSaleId,
            @RequestParam String userId) {

        boolean success = flashSaleService.applyFlashSale(flashSaleId, userId);
        if (success) {
            return ResponseEntity.ok("FlashSale appliquée avec succès !");
        } else {
            return ResponseEntity.badRequest().body("Impossible d’appliquer la FlashSale.");
        }
    }
}
