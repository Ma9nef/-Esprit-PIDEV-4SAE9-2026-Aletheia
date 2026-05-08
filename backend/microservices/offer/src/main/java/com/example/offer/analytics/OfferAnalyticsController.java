package com.example.offer.analytics;

import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200") // IMPORTANT: Autorise les requêtes depuis Angular
public class OfferAnalyticsController {

    private final OfferHistoryService analyticsService;

    // ============================================
    // ENDPOINTS AVANCÉS (déjà existants)
    // ============================================

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        return analyticsService.getCompleteAnalytics();
    }

    @GetMapping("/conversion-by-type")
    public Map<String, Object> getConversionByType() {
        return analyticsService.getConversionByOfferType();
    }

    @GetMapping("/best-period")
    public Map<String, Object> getBestPeriod() {
        return analyticsService.getBestSalesPeriod();
    }

    @GetMapping("/top-instructors")
    public Map<String, Object> getTopInstructors() {
        return analyticsService.getTopInstructorsWithDetails();
    }

    // ============================================
    // NOUVEAUX ENDPOINTS SIMPLES pour votre frontend
    // ============================================

    /**
     * Endpoint simple pour les ventes par type
     * Utilisé par votre composant Angular actuel
     */
    @GetMapping("/by-type")
    public List<Document> getSalesByType() {
        return analyticsService.getSalesByType();
    }

    /**
     * Endpoint simple pour les ventes par mois
     * Utilisé par votre composant Angular actuel
     */
    @GetMapping("/by-month")
    public List<Document> getSalesByMonth() {
        return analyticsService.getSalesByMonth();
    }

    /**
     * Endpoint simple pour les top instructeurs
     * Utilisé par votre composant Angular actuel
     */
    @GetMapping("/top-instructors-simple")
    public List<Document> getTopInstructorsSimple() {
        return analyticsService.getTopInstructors();
    }
}