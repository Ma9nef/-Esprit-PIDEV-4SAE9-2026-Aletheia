package com.example.offer.controller;

import com.example.offer.dto.SubscriptionPlanRecommendationDTO;
import com.example.offer.dto.SubscriptionPlanResponseDTO;
import com.example.offer.service.SubscriptionPlanService;
import com.example.offer.service.SubscriptionRecommendationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = SubscriptionPlanControllerWebMvcTest.TestConfig.class)
@AutoConfigureMockMvc(addFilters = false)
class SubscriptionPlanControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubscriptionPlanService subscriptionPlanService;

    @MockBean
    private SubscriptionRecommendationService subscriptionRecommendationService;

    @SpringBootConfiguration
    @EnableAutoConfiguration
    @Import(SubscriptionPlanController.class)
    static class TestConfig {
    }

    @Test
    void getActivePlans_shouldReturnAvailablePlans() throws Exception {
        SubscriptionPlanResponseDTO plan = new SubscriptionPlanResponseDTO(true, "Succès");
        plan.setPlanId("plan-1");
        plan.setName("Premium");
        plan.setPrice(99.0);

        when(subscriptionPlanService.getActivePlans()).thenReturn(List.of(plan));

        mockMvc.perform(get("/api/subscription-plans/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].planId").value("plan-1"))
                .andExpect(jsonPath("$[0].name").value("Premium"))
                .andExpect(jsonPath("$[0].price").value(99.0));
    }

    @Test
    void recommendPlan_shouldReturnRecommendationPayload() throws Exception {
        SubscriptionPlanRecommendationDTO recommendation = new SubscriptionPlanRecommendationDTO();
        recommendation.setSuccess(true);
        recommendation.setUserId("user-1");
        recommendation.setRecommendedPlanId("plan-1");
        recommendation.setRecommendedPlanName("Premium");
        recommendation.setConfidenceScore(92);
        recommendation.setRecommendationType("LOYALTY_RENEWAL");

        when(subscriptionRecommendationService.recommendPlanForUser("user-1")).thenReturn(recommendation);

        mockMvc.perform(get("/api/subscription-plans/recommendation/user-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.recommendedPlanId").value("plan-1"))
                .andExpect(jsonPath("$.recommendedPlanName").value("Premium"))
                .andExpect(jsonPath("$.recommendationType").value("LOYALTY_RENEWAL"));
    }
}
