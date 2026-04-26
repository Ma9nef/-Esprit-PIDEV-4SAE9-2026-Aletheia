package com.example.offer.service;

import com.example.offer.dto.SubscriptionCheckoutRequestDTO;
import com.example.offer.dto.SubscriptionCheckoutResponseDTO;
import com.example.offer.model.Subscription;
import com.example.offer.model.SubscriptionPayment;
import com.example.offer.model.SubscriptionPaymentStatus;
import com.example.offer.model.SubscriptionPlan;
import com.example.offer.repository.SubscriptionPaymentRepository;
import com.example.offer.repository.SubscriptionPlanRepository;
import com.example.offer.repository.SubscriptionRepository;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionPaymentServiceTest {

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @Mock
    private SubscriptionPaymentRepository subscriptionPaymentRepository;

    @Mock
    private SubscriptionNotificationService notificationService;

    @InjectMocks
    private SubscriptionPaymentService subscriptionPaymentService;

    @AfterEach
    void clearStripeApiKey() {
        com.stripe.Stripe.apiKey = null;
    }

    @Test
    void createCheckoutSession_shouldRejectMissingUserId() {
        ReflectionTestUtils.setField(subscriptionPaymentService, "stripeSecretKey", "sk_test");

        SubscriptionCheckoutRequestDTO request = new SubscriptionCheckoutRequestDTO();
        request.setPlanId("plan-1");
        request.setSuccessUrl("http://localhost/success");
        request.setCancelUrl("http://localhost/cancel");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> subscriptionPaymentService.createCheckoutSession(request)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Le userId est obligatoire", exception.getReason());
    }

    @Test
    void createCheckoutSession_shouldRejectInactivePlan() {
        ReflectionTestUtils.setField(subscriptionPaymentService, "stripeSecretKey", "sk_test");

        SubscriptionCheckoutRequestDTO request = validRequest();

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId("plan-1");
        plan.setIsActive(false);

        when(subscriptionRepository.findActiveSubscriptionByUserId(eq("user-1"), any())).thenReturn(Optional.empty());
        when(subscriptionPlanRepository.findById("plan-1")).thenReturn(Optional.of(plan));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> subscriptionPaymentService.createCheckoutSession(request)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        assertEquals("Ce plan d'abonnement est inactif", exception.getReason());
    }

    @Test
    void createCheckoutSession_shouldMarkPaymentFailedWhenStripeSessionCreationFails() {
        ReflectionTestUtils.setField(subscriptionPaymentService, "stripeSecretKey", "sk_test");
        ReflectionTestUtils.setField(subscriptionPaymentService, "stripeCurrency", "eur");

        SubscriptionCheckoutRequestDTO request = validRequest();

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId("plan-1");
        plan.setName("Premium");
        plan.setDescription("Premium plan");
        plan.setPrice(49.99);
        plan.setDurationDays(30);
        plan.setCertificationIncluded(true);
        plan.setIsActive(true);

        when(subscriptionRepository.findActiveSubscriptionByUserId(eq("user-1"), any())).thenReturn(Optional.empty());
        when(subscriptionPlanRepository.findById("plan-1")).thenReturn(Optional.of(plan));
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(invocation -> {
            Subscription subscription = invocation.getArgument(0);
            if (subscription.getId() == null) {
                subscription.setId("sub-1");
            }
            return subscription;
        });
        when(subscriptionPaymentRepository.save(any(SubscriptionPayment.class))).thenAnswer(invocation -> {
            SubscriptionPayment payment = invocation.getArgument(0);
            if (payment.getId() == null) {
                payment.setId("payment-1");
            }
            return payment;
        });

        try (MockedStatic<Session> sessionMock = mockStatic(Session.class)) {
            sessionMock.when(() -> Session.create(any(SessionCreateParams.class))).thenThrow(new RuntimeException("Stripe down"));

            ResponseStatusException exception = assertThrows(
                    ResponseStatusException.class,
                    () -> subscriptionPaymentService.createCheckoutSession(request)
            );

            assertEquals(HttpStatus.BAD_GATEWAY, exception.getStatusCode());
            assertEquals("Impossible de creer la session Stripe: Stripe down", exception.getReason());
        }

        ArgumentCaptor<SubscriptionPayment> paymentCaptor = ArgumentCaptor.forClass(SubscriptionPayment.class);
        verify(subscriptionPaymentRepository, times(2)).save(paymentCaptor.capture());
        List<SubscriptionPayment> savedPayments = paymentCaptor.getAllValues();
        SubscriptionPayment failedPayment = savedPayments.get(savedPayments.size() - 1);
        assertEquals(SubscriptionPaymentStatus.FAILED, failedPayment.getStatus());
        assertEquals("Creation Stripe impossible", failedPayment.getFailureReason());
        assertEquals("EUR", savedPayments.get(0).getCurrency());

        ArgumentCaptor<Subscription> subscriptionCaptor = ArgumentCaptor.forClass(Subscription.class);
        verify(subscriptionRepository, times(2)).save(subscriptionCaptor.capture());
        Subscription canceledSubscription = subscriptionCaptor.getAllValues().get(1);
        assertEquals("CANCELED", canceledSubscription.getStatus());
        verify(notificationService).notifyPaymentFailed("user-1", "plan-1", "Premium", "sub-1",
                "Unable to create Stripe checkout session.");
    }

    @Test
    void createCheckoutSession_shouldReturnStripeCheckoutDetailsOnSuccess() {
        ReflectionTestUtils.setField(subscriptionPaymentService, "stripeSecretKey", "sk_test");
        ReflectionTestUtils.setField(subscriptionPaymentService, "stripeCurrency", "eur");

        SubscriptionCheckoutRequestDTO request = validRequest();

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId("plan-1");
        plan.setName("Premium");
        plan.setDescription("Premium plan");
        plan.setPrice(19.99);
        plan.setDurationDays(30);
        plan.setCertificationIncluded(false);
        plan.setIsActive(true);

        when(subscriptionRepository.findActiveSubscriptionByUserId(eq("user-1"), any())).thenReturn(Optional.empty());
        when(subscriptionPlanRepository.findById("plan-1")).thenReturn(Optional.of(plan));
        when(subscriptionRepository.save(any(Subscription.class))).thenAnswer(invocation -> {
            Subscription subscription = invocation.getArgument(0);
            if (subscription.getId() == null) {
                subscription.setId("sub-1");
            }
            return subscription;
        });
        when(subscriptionPaymentRepository.save(any(SubscriptionPayment.class))).thenAnswer(invocation -> {
            SubscriptionPayment payment = invocation.getArgument(0);
            if (payment.getId() == null) {
                payment.setId("payment-1");
            }
            return payment;
        });

        Session session = new Session();
        session.setId("cs_test_123");
        session.setUrl("https://checkout.stripe.test/session");

        try (MockedStatic<Session> sessionMock = mockStatic(Session.class)) {
            sessionMock.when(() -> Session.create(any(SessionCreateParams.class))).thenReturn(session);

            SubscriptionCheckoutResponseDTO response = subscriptionPaymentService.createCheckoutSession(request);

            assertEquals("https://checkout.stripe.test/session", response.getCheckoutUrl());
            assertEquals("cs_test_123", response.getSessionId());
            assertEquals("payment-1", response.getPaymentId());
            assertEquals("sub-1", response.getSubscriptionId());
        }

        verify(notificationService, never()).notifyPaymentFailed(any(), any(), any(), any(), any());
    }

    @Test
    void getPaymentHistoryByUser_shouldMapPaymentEntitiesToDto() {
        SubscriptionPayment payment = new SubscriptionPayment();
        payment.setId("payment-1");
        payment.setUserId("user-1");
        payment.setPlanId("plan-1");
        payment.setPlanName("Premium");
        payment.setSubscriptionId("sub-1");
        payment.setSubscriptionNumber("SUB-1");
        payment.setAmount(20.0);
        payment.setCurrency("EUR");
        payment.setProvider("STRIPE");
        payment.setStatus(SubscriptionPaymentStatus.SUCCESS);

        when(subscriptionPaymentRepository.findByUserIdOrderByCreatedAtDesc("user-1")).thenReturn(List.of(payment));

        var history = subscriptionPaymentService.getPaymentHistoryByUser("user-1");

        assertEquals(1, history.size());
        assertEquals("payment-1", history.get(0).getPaymentId());
        assertEquals("SUCCESS", history.get(0).getStatus());
        assertEquals("Premium", history.get(0).getPlanName());
    }

    @Test
    void handleStripeWebhook_shouldRequireConfiguredSecret() {
        ReflectionTestUtils.setField(subscriptionPaymentService, "stripeWebhookSecret", "");

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> subscriptionPaymentService.handleStripeWebhook("{}", "sig")
        );

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, exception.getStatusCode());
        assertEquals("Le secret du webhook Stripe n'est pas configure", exception.getReason());
    }

    @Test
    void handleStripeWebhook_shouldWrapInvalidStripePayload() {
        ReflectionTestUtils.setField(subscriptionPaymentService, "stripeWebhookSecret", "whsec_test");

        try (MockedStatic<com.stripe.net.Webhook> webhookMock = mockStatic(com.stripe.net.Webhook.class)) {
            webhookMock.when(() -> com.stripe.net.Webhook.constructEvent("payload", "signature", "whsec_test"))
                    .thenThrow(new RuntimeException("bad signature"));

            ResponseStatusException exception = assertThrows(
                    ResponseStatusException.class,
                    () -> subscriptionPaymentService.handleStripeWebhook("payload", "signature")
            );

            assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
            assertEquals("Webhook Stripe invalide: bad signature", exception.getReason());
        }
    }

    @Test
    void getAllPaymentHistory_shouldMapRepositoryResults() {
        SubscriptionPayment payment = new SubscriptionPayment();
        payment.setId("payment-1");
        payment.setUserId("user-1");
        payment.setPlanId("plan-1");
        payment.setPlanName("Premium");
        payment.setSubscriptionId("sub-1");
        payment.setSubscriptionNumber("SUB-1");
        payment.setAmount(20.0);
        payment.setCurrency("EUR");
        payment.setProvider("STRIPE");
        payment.setStatus(SubscriptionPaymentStatus.PENDING);

        when(subscriptionPaymentRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(payment));

        var history = subscriptionPaymentService.getAllPaymentHistory();

        assertEquals(1, history.size());
        assertEquals("payment-1", history.get(0).getPaymentId());
        assertEquals("PENDING", history.get(0).getStatus());
    }

    private SubscriptionCheckoutRequestDTO validRequest() {
        SubscriptionCheckoutRequestDTO request = new SubscriptionCheckoutRequestDTO();
        request.setUserId("user-1");
        request.setPlanId("plan-1");
        request.setSuccessUrl("http://localhost/success");
        request.setCancelUrl("http://localhost/cancel");
        return request;
    }
}
