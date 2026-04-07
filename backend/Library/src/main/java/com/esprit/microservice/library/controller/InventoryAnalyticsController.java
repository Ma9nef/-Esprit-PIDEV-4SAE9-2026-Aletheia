package com.esprit.microservice.library.controller;

import com.esprit.microservice.library.dto.*;
import com.esprit.microservice.library.service.InventoryAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.List;

/**
 * Admin-only read-only analytics API.
 *
 * GET /api/analytics/report                         – full dashboard report
 * GET /api/analytics/top-borrowed?limit=10          – most borrowed products
 * GET /api/analytics/least-borrowed?limit=10        – least borrowed products
 * GET /api/analytics/trends?year=2026               – monthly borrow trends
 * GET /api/analytics/high-demand                    – out-of-stock but still borrowed
 * GET /api/analytics/underutilized                  – not borrowed in 90 days
 */
@RestController
@RequestMapping("/api/inventory-analytics")
@CrossOrigin(origins = "*")
public class InventoryAnalyticsController {

    private final InventoryAnalyticsService analyticsService;

    public InventoryAnalyticsController(InventoryAnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/report")
    public ResponseEntity<InventoryAnalyticsReport> fullReport() {
        return ResponseEntity.ok(analyticsService.getFullReport());
    }

    @GetMapping("/top-borrowed")
    public ResponseEntity<List<TopProductDTO>> topBorrowed(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(analyticsService.getTopBorrowedProducts(limit));
    }

    @GetMapping("/least-borrowed")
    public ResponseEntity<List<TopProductDTO>> leastBorrowed(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(analyticsService.getLeastBorrowedProducts(limit));
    }

    @GetMapping("/trends")
    public ResponseEntity<List<BorrowTrendDTO>> trends(
            @RequestParam(defaultValue = "0") int year) {
        int resolvedYear = year > 0 ? year : Year.now().getValue();
        return ResponseEntity.ok(analyticsService.getBorrowTrends(resolvedYear));
    }

    @GetMapping("/high-demand")
    public ResponseEntity<List<InventoryInsightDTO>> highDemand() {
        return ResponseEntity.ok(analyticsService.getHighDemandInsights());
    }

    @GetMapping("/underutilized")
    public ResponseEntity<List<InventoryInsightDTO>> underutilized() {
        return ResponseEntity.ok(analyticsService.getUnderutilizedInsights());
    }
}
