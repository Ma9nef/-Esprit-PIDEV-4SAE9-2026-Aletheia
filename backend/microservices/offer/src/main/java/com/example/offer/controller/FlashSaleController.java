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

    // Lister toutes les FlashSales
    @GetMapping
    public ResponseEntity<List<FlashSale>> getAllFlashSales() {
        return ResponseEntity.ok(flashSaleService.getAllFlashSales());
    }

    // Lister toutes les FlashSales actives
    @GetMapping("/active")
    public ResponseEntity<List<FlashSale>> getActiveFlashSales() {
        return ResponseEntity.ok(flashSaleService.getActiveFlashSales());
    }

    // Récupérer une FlashSale par ID
    @GetMapping("/{flashSaleId}")
    public ResponseEntity<FlashSale> getFlashSaleById(@PathVariable String flashSaleId) {
        return ResponseEntity.ok(flashSaleService.getFlashSaleById(flashSaleId));
    }

    // Créer une FlashSale
    @PostMapping
    public ResponseEntity<FlashSale> createFlashSale(@RequestBody FlashSale flashSale) {
        FlashSale saved = flashSaleService.createFlashSale(flashSale);
        return ResponseEntity.ok(saved);
    }

    // Mettre à jour une FlashSale
    @PutMapping("/{flashSaleId}")
    public ResponseEntity<FlashSale> updateFlashSale(
            @PathVariable String flashSaleId,
            @RequestBody FlashSale flashSale) {
        return ResponseEntity.ok(flashSaleService.updateFlashSale(flashSaleId, flashSale));
    }

    // Supprimer une FlashSale
    @DeleteMapping("/{flashSaleId}")
    public ResponseEntity<Void> deleteFlashSale(@PathVariable String flashSaleId) {
        flashSaleService.deleteFlashSale(flashSaleId);
        return ResponseEntity.noContent().build();
    }

    // Activer/Désactiver une FlashSale
    @PatchMapping("/{flashSaleId}/toggle")
    public ResponseEntity<FlashSale> toggleFlashSaleStatus(@PathVariable String flashSaleId) {
        FlashSale flashSale = flashSaleService.getFlashSaleById(flashSaleId);
        flashSale.setIsActive(!Boolean.TRUE.equals(flashSale.getIsActive()));
        return ResponseEntity.ok(flashSaleService.updateFlashSale(flashSaleId, flashSale));
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
