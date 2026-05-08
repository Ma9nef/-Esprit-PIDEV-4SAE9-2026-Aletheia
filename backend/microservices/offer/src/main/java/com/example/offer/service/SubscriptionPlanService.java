package com.example.offer.service;

import com.example.offer.dto.SubscriptionPlanRequestDTO;
import com.example.offer.dto.SubscriptionPlanResponseDTO;
import com.example.offer.model.SubscriptionPlan;
import com.example.offer.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionPlanService {

    private final SubscriptionPlanRepository planRepository;

    // Récupérer tous les plans
    public List<SubscriptionPlanResponseDTO> getAllPlans() {
        return planRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Récupérer les plans actifs
    public List<SubscriptionPlanResponseDTO> getActivePlans() {
        return planRepository.findByIsActiveTrue().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Récupérer un plan par ID
    public SubscriptionPlanResponseDTO getPlanById(String id) {
        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan non trouvé"));
        return convertToResponseDTO(plan);
    }

    // Créer un plan
    public SubscriptionPlanResponseDTO createPlan(SubscriptionPlanRequestDTO request) {
        // Vérifier si le nom existe déjà
        if (planRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Un plan avec ce nom existe déjà");
        }

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setName(request.getName());
        plan.setDescription(request.getDescription());
        plan.setPrice(request.getPrice());
        plan.setDurationDays(request.getDurationDays());
        plan.setMaxCourses(request.getMaxCourses());
        plan.setCertificationIncluded(request.getCertificationIncluded());
        plan.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());

        SubscriptionPlan saved = planRepository.save(plan);
        return convertToResponseDTO(saved);
    }

    // Mettre à jour un plan
    public SubscriptionPlanResponseDTO updatePlan(String id, SubscriptionPlanRequestDTO request) {
        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan non trouvé"));

        plan.setName(request.getName());
        plan.setDescription(request.getDescription());
        plan.setPrice(request.getPrice());
        plan.setDurationDays(request.getDurationDays());
        plan.setMaxCourses(request.getMaxCourses());
        plan.setCertificationIncluded(request.getCertificationIncluded());
        plan.setIsActive(request.getIsActive());
        plan.setUpdatedAt(LocalDateTime.now());

        SubscriptionPlan updated = planRepository.save(plan);
        return convertToResponseDTO(updated);
    }

    // Supprimer un plan
    public SubscriptionPlanResponseDTO deletePlan(String id) {
        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan non trouvé"));

        planRepository.delete(plan);

        SubscriptionPlanResponseDTO response = new SubscriptionPlanResponseDTO(true, "Plan supprimé avec succès");
        response.setPlanId(id);
        response.setName(plan.getName());
        return response;
    }

    // Activer/Désactiver un plan
    public SubscriptionPlanResponseDTO togglePlanStatus(String id) {
        SubscriptionPlan plan = planRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan non trouvé"));

        plan.setIsActive(!plan.getIsActive());
        plan.setUpdatedAt(LocalDateTime.now());

        SubscriptionPlan updated = planRepository.save(plan);
        return convertToResponseDTO(updated);
    }

    // Conversion
    private SubscriptionPlanResponseDTO convertToResponseDTO(SubscriptionPlan plan) {
        SubscriptionPlanResponseDTO dto = new SubscriptionPlanResponseDTO(true, "Succès");
        dto.setPlanId(plan.getId());
        dto.setName(plan.getName());
        dto.setDescription(plan.getDescription());
        dto.setPrice(plan.getPrice());
        dto.setDurationDays(plan.getDurationDays());
        dto.setMaxCourses(plan.getMaxCourses());
        dto.setCertificationIncluded(plan.getCertificationIncluded());
        dto.setIsActive(plan.getIsActive());
        return dto;
    }
}