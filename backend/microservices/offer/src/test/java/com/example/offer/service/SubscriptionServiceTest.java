package com.example.offer.service;

import com.example.offer.dto.SubscriptionRequestDTO;
import com.example.offer.dto.SubscriptionResponseDTO;
import com.example.offer.dto.UserSubscriptionDTO;
import com.example.offer.model.Subscription;
import com.example.offer.model.SubscriptionPlan;
import com.example.offer.repository.SubscriptionPlanRepository;
import com.example.offer.repository.SubscriptionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private SubscriptionPlanRepository planRepository;

    @Mock
    private SubscriptionNotificationService notificationService;

    @InjectMocks
    private SubscriptionService subscriptionService;

    @Test
    void createSubscription_shouldRejectUserWithExistingActiveSubscription() {
        SubscriptionRequestDTO request = new SubscriptionRequestDTO();
        request.setUserId("user-1");
        request.setPlanId("plan-1");

        when(subscriptionRepository.findActiveSubscriptionByUserId(eq("user-1"), any(LocalDateTime.class)))
                .thenReturn(Optional.of(new Subscription()));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> subscriptionService.createSubscription(request)
        );

        assertEquals("L'utilisateur a déjà un abonnement actif", exception.getMessage());
        verify(planRepository, never()).findById(any());
        verify(subscriptionRepository, never()).save(any());
    }

    @Test
    void createSubscription_shouldUsePlanDefaultsAndReturnEnrichedResponse() {
        LocalDateTime startDate = LocalDateTime.of(2026, 4, 11, 9, 30);

        SubscriptionRequestDTO request = new SubscriptionRequestDTO();
        request.setUserId("user-1");
        request.setPlanId("plan-1");
        request.setStartDate(startDate);
        request.setStatus(null);

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId("plan-1");
        plan.setName("Premium");
        plan.setDescription("Acces premium");
        plan.setPrice(99.0);
        plan.setDurationDays(30);
        plan.setMaxCourses(12);
        plan.setCertificationIncluded(true);
        plan.setIsActive(true);

        when(subscriptionRepository.findActiveSubscriptionByUserId(eq("user-1"), any(LocalDateTime.class)))
                .thenReturn(Optional.empty());
        when(planRepository.findById("plan-1")).thenReturn(Optional.of(plan));
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(invocation -> {
            Subscription subscription = invocation.getArgument(0);
            subscription.setId("sub-1");
            return subscription;
        });

        SubscriptionResponseDTO response = subscriptionService.createSubscription(request);

        assertTrue(response.isSuccess());
        assertEquals("sub-1", response.getSubscriptionId());
        assertEquals("user-1", response.getUserId());
        assertEquals("plan-1", response.getPlanId());
        assertEquals("Premium", response.getPlanName());
        assertEquals(99.0, response.getPlanPrice());
        assertEquals(30, response.getDurationDays());
        assertEquals(12, response.getMaxCourses());
        assertTrue(response.getCertificationIncluded());
        assertTrue(response.getPlanActive());
        assertEquals("ACTIVE", response.getStatus());
        assertEquals(startDate, response.getStartDate());
        assertEquals(startDate.plusDays(30), response.getEndDate());
        assertNotNull(response.getCreatedAt());
        assertNotNull(response.getUpdatedAt());
        assertNotNull(response.getSubscriptionNumber());
        assertTrue(response.getSubscriptionNumber().startsWith("SUB-"));

        ArgumentCaptor<Subscription> captor = ArgumentCaptor.forClass(Subscription.class);
        verify(subscriptionRepository).save(captor.capture());
        assertEquals("ACTIVE", captor.getValue().getStatus());
        assertEquals(startDate.plusDays(30), captor.getValue().getEndDate());
    }

    @Test
    void getActiveSubscriptionByUser_shouldReturnFalseWhenNoSubscriptionExists() {
        when(subscriptionRepository.findActiveSubscriptionByUserId(eq("user-1"), any(LocalDateTime.class)))
                .thenReturn(Optional.empty());

        UserSubscriptionDTO result = subscriptionService.getActiveSubscriptionByUser("user-1");

        assertFalse(result.isHasActiveSubscription());
    }

    @Test
    void cancelSubscription_shouldSetCanceledStatusAndSuccessMessage() {
        Subscription subscription = new Subscription();
        subscription.setId("sub-1");
        subscription.setUserId("user-1");
        subscription.setPlanId("plan-1");
        subscription.setSubscriptionNumber("SUB-20260411090000-ABCD1234");
        subscription.setStatus("ACTIVE");
        subscription.setStartDate(LocalDateTime.of(2026, 4, 1, 0, 0));
        subscription.setEndDate(LocalDateTime.of(2026, 5, 1, 0, 0));
        subscription.setCreatedAt(LocalDateTime.of(2026, 4, 1, 0, 0));
        subscription.setUpdatedAt(LocalDateTime.of(2026, 4, 1, 0, 0));

        when(subscriptionRepository.findById("sub-1")).thenReturn(Optional.of(subscription));
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(planRepository.findById("plan-1")).thenReturn(Optional.empty());

        SubscriptionResponseDTO response = subscriptionService.cancelSubscription("sub-1");

        assertEquals("CANCELED", response.getStatus());
        assertEquals("Abonnement annulé avec succès", response.getMessage());
        assertEquals("sub-1", response.getSubscriptionId());
        verify(subscriptionRepository).save(subscription);
    }

    @Test
    void checkExpiredSubscriptions_shouldExpireSubscriptionsAndNotifyUsers() {
        Subscription expiredSubscription = new Subscription();
        expiredSubscription.setId("sub-1");
        expiredSubscription.setUserId("user-1");
        expiredSubscription.setPlanId("plan-1");
        expiredSubscription.setSubscriptionNumber("SUB-20260401080000-ZYXW9876");
        expiredSubscription.setStatus("ACTIVE");
        expiredSubscription.setEndDate(LocalDateTime.now().minusDays(1));

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId("plan-1");
        plan.setName("Premium");

        when(subscriptionRepository.findByStatusAndEndDateBefore(eq("ACTIVE"), any(LocalDateTime.class)))
                .thenReturn(List.of(expiredSubscription));
        when(planRepository.findById("plan-1")).thenReturn(Optional.of(plan));
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(invocation -> invocation.getArgument(0));

        subscriptionService.checkExpiredSubscriptions();

        assertEquals("EXPIRED", expiredSubscription.getStatus());
        assertNotNull(expiredSubscription.getUpdatedAt());
        verify(subscriptionRepository).save(expiredSubscription);
        verify(notificationService).notifySubscriptionExpired(expiredSubscription, plan);
    }
}
