package com.example.offer.service;

import com.example.offer.dto.RecommendationTrainingRowDTO;
import com.example.offer.dto.SubscriptionPlanRecommendationDTO;
import com.example.offer.model.Subscription;
import com.example.offer.model.SubscriptionPayment;
import com.example.offer.model.SubscriptionPaymentStatus;
import com.example.offer.model.SubscriptionPlan;
import com.example.offer.repository.SubscriptionPaymentRepository;
import com.example.offer.repository.SubscriptionPlanRepository;
import com.example.offer.repository.SubscriptionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionRecommendationServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Mock
    private SubscriptionPaymentRepository subscriptionPaymentRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private SubscriptionRecommendationService subscriptionRecommendationService;

    @Test
    void recommendPlanForUser_shouldThrowWhenNoActivePlansExist() {
        when(subscriptionPlanRepository.findByIsActiveTrueOrderByPriceAsc()).thenReturn(List.of());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> subscriptionRecommendationService.recommendPlanForUser("user-1")
        );

        assertEquals("Aucun plan actif disponible pour la recommandation", exception.getMessage());
    }

    @Test
    void recommendPlanForUser_shouldUseLoyaltyHeuristicWhenUserIsLoyal() {
        ReflectionTestUtils.setField(subscriptionRecommendationService, "mlEnabled", false);

        SubscriptionPlan basic = plan("plan-basic", "Basic", 10.0);
        SubscriptionPlan premium = plan("plan-premium", "Premium", 30.0);

        when(subscriptionPlanRepository.findByIsActiveTrueOrderByPriceAsc()).thenReturn(List.of(basic, premium));
        when(subscriptionRepository.findByUserId("user-1")).thenReturn(List.of(
                subscription("sub-1", "user-1", "plan-premium", "ACTIVE", LocalDateTime.now().minusDays(90)),
                subscription("sub-2", "user-1", "plan-premium", "ACTIVE", LocalDateTime.now().minusDays(60)),
                subscription("sub-3", "user-1", "plan-premium", "ACTIVE", LocalDateTime.now().minusDays(30))
        ));
        when(subscriptionPaymentRepository.findByUserIdOrderByCreatedAtDesc("user-1")).thenReturn(List.of(
                payment("sub-1", SubscriptionPaymentStatus.SUCCESS),
                payment("sub-2", SubscriptionPaymentStatus.SUCCESS),
                payment("sub-3", SubscriptionPaymentStatus.SUCCESS)
        ));

        SubscriptionPlanRecommendationDTO recommendation = subscriptionRecommendationService.recommendPlanForUser("user-1");

        assertTrue(recommendation.isSuccess());
        assertEquals("plan-premium", recommendation.getRecommendedPlanId());
        assertEquals("LOYALTY_RENEWAL", recommendation.getRecommendationType());
        assertTrue(recommendation.getReasons().get(0).contains("renewed most often"));
        assertTrue(recommendation.getFeatures().getLoyalCustomer());
        assertFalse(recommendation.getFeatures().getFastCancellationProfile());
    }

    @Test
    void recommendPlanForUser_shouldUseBudgetHeuristicWhenPaymentHistoryIsRisky() {
        ReflectionTestUtils.setField(subscriptionRecommendationService, "mlEnabled", false);

        SubscriptionPlan basic = plan("plan-basic", "Basic", 10.0);
        SubscriptionPlan premium = plan("plan-premium", "Premium", 30.0);

        when(subscriptionPlanRepository.findByIsActiveTrueOrderByPriceAsc()).thenReturn(List.of(basic, premium));
        when(subscriptionRepository.findByUserId("user-2")).thenReturn(List.of(
                subscription("sub-1", "user-2", "plan-premium", "CANCELED", LocalDateTime.now().minusDays(10))
        ));
        when(subscriptionPaymentRepository.findByUserIdOrderByCreatedAtDesc("user-2")).thenReturn(List.of(
                payment("sub-1", SubscriptionPaymentStatus.FAILED)
        ));

        SubscriptionPlanRecommendationDTO recommendation = subscriptionRecommendationService.recommendPlanForUser("user-2");

        assertEquals("plan-basic", recommendation.getRecommendedPlanId());
        assertEquals("FLEXIBLE_BUDGET", recommendation.getRecommendationType());
        assertTrue(recommendation.getFeatures().getFastCancellationProfile());
        assertEquals(0.0, recommendation.getFeatures().getPaymentSuccessRate());
    }

    @Test
    void recommendPlanForUser_shouldReuseLastPlanOnPreviousSuccessfulPayment() {
        ReflectionTestUtils.setField(subscriptionRecommendationService, "mlEnabled", false);

        SubscriptionPlan basic = plan("plan-basic", "Basic", 10.0);
        SubscriptionPlan premium = plan("plan-premium", "Premium", 30.0);

        when(subscriptionPlanRepository.findByIsActiveTrueOrderByPriceAsc()).thenReturn(List.of(basic, premium));
        when(subscriptionRepository.findByUserId("user-3")).thenReturn(List.of(
                subscription("sub-1", "user-3", "plan-premium", "ACTIVE", LocalDateTime.now().minusDays(20))
        ));
        when(subscriptionPaymentRepository.findByUserIdOrderByCreatedAtDesc("user-3")).thenReturn(List.of(
                payment("sub-1", SubscriptionPaymentStatus.SUCCESS)
        ));

        SubscriptionPlanRecommendationDTO recommendation = subscriptionRecommendationService.recommendPlanForUser("user-3");

        assertEquals("plan-premium", recommendation.getRecommendedPlanId());
        assertEquals("PREVIOUS_SUCCESS", recommendation.getRecommendationType());
    }

    @Test
    void exportTrainingDataset_shouldKeepOnlyUsersWithSuccessfulSubscriptions() {
        when(subscriptionRepository.findAll()).thenReturn(List.of(
                subscription("sub-1", "user-1", "plan-basic", "ACTIVE", LocalDateTime.now().minusDays(10)),
                subscription("sub-2", "user-1", "plan-premium", "ACTIVE", LocalDateTime.now().minusDays(1)),
                subscription("sub-3", "user-2", "plan-basic", "CANCELED", LocalDateTime.now().minusDays(5))
        ));
        when(subscriptionRepository.findByUserId("user-1")).thenReturn(List.of(
                subscription("sub-1", "user-1", "plan-basic", "ACTIVE", LocalDateTime.now().minusDays(10)),
                subscription("sub-2", "user-1", "plan-premium", "ACTIVE", LocalDateTime.now().minusDays(1))
        ));
        when(subscriptionRepository.findByUserId("user-2")).thenReturn(List.of(
                subscription("sub-3", "user-2", "plan-basic", "CANCELED", LocalDateTime.now().minusDays(5))
        ));
        when(subscriptionPaymentRepository.findByUserIdOrderByCreatedAtDesc("user-1")).thenReturn(List.of(
                payment("sub-2", SubscriptionPaymentStatus.SUCCESS)
        ));
        when(subscriptionPaymentRepository.findByUserIdOrderByCreatedAtDesc("user-2")).thenReturn(List.of(
                payment("sub-3", SubscriptionPaymentStatus.FAILED)
        ));

        List<RecommendationTrainingRowDTO> dataset = subscriptionRecommendationService.exportTrainingDataset();

        assertEquals(1, dataset.size());
        assertEquals("user-1", dataset.get(0).getUserId());
        assertEquals("plan-premium", dataset.get(0).getLabelPlanId());
    }

    private SubscriptionPlan plan(String id, String name, double price) {
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId(id);
        plan.setName(name);
        plan.setPrice(price);
        return plan;
    }

    private Subscription subscription(String id, String userId, String planId, String status, LocalDateTime createdAt) {
        Subscription subscription = new Subscription();
        subscription.setId(id);
        subscription.setUserId(userId);
        subscription.setPlanId(planId);
        subscription.setStatus(status);
        subscription.setCreatedAt(createdAt);
        return subscription;
    }

    private SubscriptionPayment payment(String subscriptionId, SubscriptionPaymentStatus status) {
        SubscriptionPayment payment = new SubscriptionPayment();
        payment.setSubscriptionId(subscriptionId);
        payment.setStatus(status);
        return payment;
    }
}
