package com.example.offer.service;

import com.example.offer.dto.SubscriptionRequestDTO;
import com.example.offer.dto.SubscriptionResponseDTO;
import com.example.offer.dto.UserSubscriptionDTO;
import com.example.offer.model.Subscription;
import com.example.offer.model.SubscriptionPlan;
import com.example.offer.repository.SubscriptionRepository;
import com.example.offer.repository.SubscriptionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository planRepository;

    // Récupérer tous les abonnements
    public List<SubscriptionResponseDTO> getAllSubscriptions() {
        return subscriptionRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Récupérer un abonnement par ID
    public SubscriptionResponseDTO getSubscriptionById(String id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonnement non trouvé"));
        return convertToResponseDTO(subscription);
    }

    // Récupérer les abonnements d'un utilisateur
    public List<SubscriptionResponseDTO> getSubscriptionsByUser(String userId) {
        return subscriptionRepository.findByUserId(userId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Récupérer l'abonnement actif d'un utilisateur
    public UserSubscriptionDTO getActiveSubscriptionByUser(String userId) {
        Subscription subscription = subscriptionRepository
                .findActiveSubscriptionByUserId(userId, LocalDateTime.now())
                .orElse(null);

        if (subscription == null) {
            return new UserSubscriptionDTO(false);
        }

        SubscriptionPlan plan = planRepository.findById(subscription.getPlanId()).orElse(null);

        UserSubscriptionDTO dto = new UserSubscriptionDTO(true);
        dto.setSubscriptionId(subscription.getId());
        dto.setPlanName(plan != null ? plan.getName() : "Inconnu");
        dto.setStartDate(subscription.getStartDate());
        dto.setEndDate(subscription.getEndDate());
        dto.setDaysRemaining(calculateDaysRemaining(subscription.getEndDate()));

        if (plan != null) {
            dto.setCoursesLimit(plan.getMaxCourses());
            dto.setCanGetCertification(plan.getCertificationIncluded());
        }

        return dto;
    }

    // Créer un abonnement
    public SubscriptionResponseDTO createSubscription(SubscriptionRequestDTO request) {
        // Vérifier si l'utilisateur a déjà un abonnement actif
        if (subscriptionRepository.findActiveSubscriptionByUserId(request.getUserId(), LocalDateTime.now()).isPresent()) {
            throw new RuntimeException("L'utilisateur a déjà un abonnement actif");
        }

        // Vérifier si le plan existe
        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan non trouvé"));

        Subscription subscription = new Subscription();
        subscription.setUserId(request.getUserId());
        subscription.setPlanId(request.getPlanId());

        // Dates
        LocalDateTime startDate = request.getStartDate() != null ? request.getStartDate() : LocalDateTime.now();
        subscription.setStartDate(startDate);

        if (request.getEndDate() != null) {
            subscription.setEndDate(request.getEndDate());
        } else {
            subscription.setEndDate(startDate.plusDays(plan.getDurationDays()));
        }

        // Statut
        subscription.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        // Générer numéro unique
        subscription.setSubscriptionNumber(generateSubscriptionNumber());

        // Métadonnées
        subscription.setCreatedAt(LocalDateTime.now());
        subscription.setUpdatedAt(LocalDateTime.now());

        Subscription saved = subscriptionRepository.save(subscription);
        return convertToResponseDTO(saved);
    }

    // Annuler un abonnement
    public SubscriptionResponseDTO cancelSubscription(String id) {
        Subscription subscription = subscriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonnement non trouvé"));

        subscription.setStatus("CANCELED");
        subscription.setUpdatedAt(LocalDateTime.now());

        Subscription cancelled = subscriptionRepository.save(subscription);

        SubscriptionResponseDTO response = convertToResponseDTO(cancelled);
        response.setMessage("Abonnement annulé avec succès");
        return response;
    }

    // Vérifier l'accès à un cours
    public boolean hasCourseAccess(String userId, String courseId) {
        Subscription activeSub = subscriptionRepository
                .findActiveSubscriptionByUserId(userId, LocalDateTime.now())
                .orElse(null);

        if (activeSub == null) return false;

        // Logique spécifique pour vérifier l'accès au cours
        // Par exemple, vérifier si le plan permet ce cours
        return true;
    }

    // Vérifier les abonnements expirés (à appeler par une tâche planifiée)
    public void checkExpiredSubscriptions() {
        List<Subscription> expired = subscriptionRepository
                .findByStatusAndEndDateBefore("ACTIVE", LocalDateTime.now());

        for (Subscription sub : expired) {
            sub.setStatus("EXPIRED");
            sub.setUpdatedAt(LocalDateTime.now());
            subscriptionRepository.save(sub);
        }
    }

    // Méthodes privées
    private String generateSubscriptionNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "SUB-" + timestamp + "-" + random;
    }

    private int calculateDaysRemaining(LocalDateTime endDate) {
        return (int) java.time.Duration.between(LocalDateTime.now(), endDate).toDays();
    }

    private SubscriptionResponseDTO convertToResponseDTO(Subscription subscription) {
        SubscriptionResponseDTO dto = new SubscriptionResponseDTO(true, "Succès");
        dto.setSubscriptionId(subscription.getId());
        dto.setSubscriptionNumber(subscription.getSubscriptionNumber());
        dto.setUserId(subscription.getUserId());
        dto.setStartDate(subscription.getStartDate());
        dto.setEndDate(subscription.getEndDate());
        dto.setStatus(subscription.getStatus());

        // Ajouter le nom du plan
        planRepository.findById(subscription.getPlanId()).ifPresent(plan ->
                dto.setPlanName(plan.getName())
        );

        return dto;
    }
}