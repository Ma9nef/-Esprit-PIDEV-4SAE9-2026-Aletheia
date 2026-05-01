package com.example.offer.controller;

import com.example.offer.dto.SubscriptionCheckoutResponseDTO;
import com.example.offer.dto.SubscriptionPaymentResponseDTO;
import com.example.offer.dto.SubscriptionResponseDTO;
import com.example.offer.service.SubscriptionPaymentService;
import com.example.offer.service.SubscriptionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = SubscriptionControllerWebMvcTest.TestConfig.class)
@AutoConfigureMockMvc(addFilters = false)
class SubscriptionControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubscriptionService subscriptionService;

    @MockBean
    private SubscriptionPaymentService subscriptionPaymentService;

    @SpringBootConfiguration
    @EnableAutoConfiguration
    @Import(SubscriptionController.class)
    static class TestConfig {
    }

    @Test
    void cancelSubscription_shouldReturnCanceledSubscriptionPayload() throws Exception {
        SubscriptionResponseDTO response = new SubscriptionResponseDTO(true, "Abonnement annulé avec succès");
        response.setSubscriptionId("sub-1");
        response.setStatus("CANCELED");

        when(subscriptionService.cancelSubscription("sub-1")).thenReturn(response);

        mockMvc.perform(post("/api/subscriptions/sub-1/cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.subscriptionId").value("sub-1"))
                .andExpect(jsonPath("$.status").value("CANCELED"))
                .andExpect(jsonPath("$.message").value("Abonnement annulé avec succès"));
    }

    @Test
    void createCheckoutSession_shouldExposeStripeCheckoutResponse() throws Exception {
        SubscriptionCheckoutResponseDTO response = new SubscriptionCheckoutResponseDTO(
                true,
                "Session Stripe creee avec succes",
                "https://checkout.stripe.test",
                "cs_test_123",
                "payment-1",
                "sub-1"
        );

        when(subscriptionPaymentService.createCheckoutSession(org.mockito.ArgumentMatchers.any())).thenReturn(response);

        mockMvc.perform(post("/api/subscriptions/checkout-session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "userId":"user-1",
                                  "planId":"plan-1",
                                  "successUrl":"http://localhost/success",
                                  "cancelUrl":"http://localhost/cancel"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.checkoutUrl").value("https://checkout.stripe.test"))
                .andExpect(jsonPath("$.sessionId").value("cs_test_123"))
                .andExpect(jsonPath("$.paymentId").value("payment-1"));
    }

    @Test
    void handleStripeWebhook_shouldDelegatePayloadAndSignature() throws Exception {
        when(subscriptionPaymentService.handleStripeWebhook(eq("{\"id\":\"evt\"}"), eq("sig_test")))
                .thenReturn("Webhook processed");

        mockMvc.perform(post("/api/subscriptions/payments/webhook")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Stripe-Signature", "sig_test")
                        .content("{\"id\":\"evt\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Webhook processed"));

        verify(subscriptionPaymentService).handleStripeWebhook("{\"id\":\"evt\"}", "sig_test");
    }

    @Test
    void getPaymentHistoryByUser_shouldReturnSerializedPaymentHistory() throws Exception {
        SubscriptionPaymentResponseDTO payment = new SubscriptionPaymentResponseDTO();
        payment.setPaymentId("payment-1");
        payment.setStatus("SUCCESS");
        payment.setPlanName("Premium");

        when(subscriptionPaymentService.getPaymentHistoryByUser("user-1")).thenReturn(List.of(payment));

        mockMvc.perform(get("/api/subscriptions/payments/user/user-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].paymentId").value("payment-1"))
                .andExpect(jsonPath("$[0].status").value("SUCCESS"))
                .andExpect(jsonPath("$[0].planName").value("Premium"));
    }
}
