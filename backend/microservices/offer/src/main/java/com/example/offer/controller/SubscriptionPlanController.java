package com.example.offer.controller;

import com.example.offer.dto.SubscriptionPlanRequestDTO;
import com.example.offer.dto.SubscriptionPlanRecommendationDTO;
import com.example.offer.dto.SubscriptionPlanResponseDTO;
import com.example.offer.service.SubscriptionRecommendationService;
import com.example.offer.service.SubscriptionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscription-plans")
@RequiredArgsConstructor
public class SubscriptionPlanController {

    private final SubscriptionPlanService planService;
    private final SubscriptionRecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<List<SubscriptionPlanResponseDTO>> getAllPlans() {
        return ResponseEntity.ok(planService.getAllPlans());
    }

    @GetMapping("/active")
    public ResponseEntity<List<SubscriptionPlanResponseDTO>> getActivePlans() {
        return ResponseEntity.ok(planService.getActivePlans());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubscriptionPlanResponseDTO> getPlanById(@PathVariable String id) {
        return ResponseEntity.ok(planService.getPlanById(id));
    }

    @GetMapping("/recommendation/{userId}")
    public ResponseEntity<SubscriptionPlanRecommendationDTO> recommendPlan(@PathVariable String userId) {
        return ResponseEntity.ok(recommendationService.recommendPlanForUser(userId));
    }

    @PostMapping
    public ResponseEntity<SubscriptionPlanResponseDTO> createPlan(@RequestBody SubscriptionPlanRequestDTO request) {
        return new ResponseEntity<>(planService.createPlan(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubscriptionPlanResponseDTO> updatePlan(
            @PathVariable String id,
            @RequestBody SubscriptionPlanRequestDTO request) {
        return ResponseEntity.ok(planService.updatePlan(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<SubscriptionPlanResponseDTO> deletePlan(@PathVariable String id) {
        return ResponseEntity.ok(planService.deletePlan(id));
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<SubscriptionPlanResponseDTO> togglePlanStatus(@PathVariable String id) {
        return ResponseEntity.ok(planService.togglePlanStatus(id));
    }
}