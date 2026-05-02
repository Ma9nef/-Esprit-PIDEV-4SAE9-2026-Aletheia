package com.example.offer.service;

import com.example.offer.dto.SubscriptionPlanRequestDTO;
import com.example.offer.dto.SubscriptionPlanResponseDTO;
import com.example.offer.model.SubscriptionPlan;
import com.example.offer.repository.SubscriptionPlanRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionPlanServiceTest {

    @Mock
    private SubscriptionPlanRepository planRepository;

    @InjectMocks
    private SubscriptionPlanService subscriptionPlanService;

    @Test
    void createPlan_shouldRejectDuplicateName() {
        SubscriptionPlanRequestDTO request = new SubscriptionPlanRequestDTO();
        request.setName("Premium");

        when(planRepository.findByName("Premium")).thenReturn(Optional.of(new SubscriptionPlan()));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> subscriptionPlanService.createPlan(request)
        );

        assertEquals("Un plan avec ce nom existe déjà", exception.getMessage());
    }

    @Test
    void createPlan_shouldDefaultToActiveAndReturnResponse() {
        SubscriptionPlanRequestDTO request = new SubscriptionPlanRequestDTO();
        request.setName("Premium");
        request.setDescription("Acces premium");
        request.setPrice(99.0);
        request.setDurationDays(30);
        request.setMaxCourses(15);
        request.setCertificationIncluded(true);
        request.setIsActive(null);

        when(planRepository.findByName("Premium")).thenReturn(Optional.empty());
        when(planRepository.save(any(SubscriptionPlan.class))).thenAnswer(invocation -> {
            SubscriptionPlan plan = invocation.getArgument(0);
            plan.setId("plan-1");
            return plan;
        });

        SubscriptionPlanResponseDTO response = subscriptionPlanService.createPlan(request);

        assertTrue(response.isSuccess());
        assertEquals("plan-1", response.getPlanId());
        assertEquals("Premium", response.getName());
        assertTrue(response.getIsActive());

        ArgumentCaptor<SubscriptionPlan> captor = ArgumentCaptor.forClass(SubscriptionPlan.class);
        verify(planRepository).save(captor.capture());
        assertTrue(captor.getValue().getIsActive());
        assertNotNull(captor.getValue().getCreatedAt());
        assertNotNull(captor.getValue().getUpdatedAt());
    }

    @Test
    void togglePlanStatus_shouldFlipActivationFlag() {
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId("plan-1");
        plan.setName("Premium");
        plan.setIsActive(true);

        when(planRepository.findById("plan-1")).thenReturn(Optional.of(plan));
        when(planRepository.save(any(SubscriptionPlan.class))).thenAnswer(invocation -> invocation.getArgument(0));

        SubscriptionPlanResponseDTO response = subscriptionPlanService.togglePlanStatus("plan-1");

        assertFalse(response.getIsActive());
        assertFalse(plan.getIsActive());
        assertNotNull(plan.getUpdatedAt());
    }

    @Test
    void deletePlan_shouldReturnDeletedPlanSummary() {
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId("plan-1");
        plan.setName("Premium");

        when(planRepository.findById("plan-1")).thenReturn(Optional.of(plan));

        SubscriptionPlanResponseDTO response = subscriptionPlanService.deletePlan("plan-1");

        assertTrue(response.isSuccess());
        assertEquals("Plan supprimé avec succès", response.getMessage());
        assertEquals("plan-1", response.getPlanId());
        assertEquals("Premium", response.getName());
        verify(planRepository).delete(plan);
    }
}
