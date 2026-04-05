package com.example.offer.service;

import com.example.offer.dto.SubscriptionCheckoutRequestDTO;
import com.example.offer.dto.SubscriptionCheckoutResponseDTO;
import com.example.offer.dto.SubscriptionPaymentResponseDTO;
import com.example.offer.model.Subscription;
import com.example.offer.model.SubscriptionPayment;
import com.example.offer.model.SubscriptionPaymentStatus;
import com.example.offer.model.SubscriptionPlan;
import com.example.offer.repository.SubscriptionPaymentRepository;
import com.example.offer.repository.SubscriptionPlanRepository;
import com.example.offer.repository.SubscriptionRepository;
import com.stripe.Stripe;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionPaymentService {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionPaymentRepository subscriptionPaymentRepository;

    @Value("${stripe.secret-key:}")
    private String stripeSecretKey;

    @Value("${stripe.webhook-secret:}")
    private String stripeWebhookSecret;

    @Value("${stripe.currency:eur}")
    private String stripeCurrency;

    public SubscriptionCheckoutResponseDTO createCheckoutSession(SubscriptionCheckoutRequestDTO request) {
        validateCheckoutRequest(request);
        ensureStripeSecretConfigured();

        if (subscriptionRepository.findActiveSubscriptionByUserId(request.getUserId(), LocalDateTime.now()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "L'utilisateur a deja un abonnement actif");
        }

        SubscriptionPlan plan = subscriptionPlanRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Plan non trouve"));

        if (!Boolean.TRUE.equals(plan.getIsActive())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ce plan d'abonnement est inactif");
        }

        Subscription subscription = buildPendingSubscription(request.getUserId(), plan);
        subscription = subscriptionRepository.save(subscription);

        SubscriptionPayment payment = buildPendingPayment(request.getUserId(), plan, subscription);
        payment = subscriptionPaymentRepository.save(payment);

        try {
            Stripe.apiKey = stripeSecretKey;

            Session session = Session.create(buildSessionParams(request, plan, payment, subscription));

            payment.setStripeSessionId(session.getId());
            payment.setCheckoutUrl(session.getUrl());
            payment.setUpdatedAt(LocalDateTime.now());
            subscriptionPaymentRepository.save(payment);

            return new SubscriptionCheckoutResponseDTO(
                    true,
                    "Session Stripe creee avec succes",
                    session.getUrl(),
                    session.getId(),
                    payment.getId(),
                    subscription.getId()
            );
        } catch (Exception exception) {
            payment.setStatus(SubscriptionPaymentStatus.FAILED);
            payment.setFailureReason("Creation Stripe impossible");
            payment.setUpdatedAt(LocalDateTime.now());
            subscriptionPaymentRepository.save(payment);

            subscription.setStatus("CANCELED");
            subscription.setUpdatedAt(LocalDateTime.now());
            subscriptionRepository.save(subscription);

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Impossible de creer la session Stripe: " + exception.getMessage(),
                    exception
            );
        }
    }

    public String handleStripeWebhook(String payload, String signatureHeader) {
        if (!StringUtils.hasText(stripeWebhookSecret)) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Le secret du webhook Stripe n'est pas configure");
        }

        try {
            Event event = Webhook.constructEvent(payload, signatureHeader, stripeWebhookSecret);
            StripeObject stripeObject = event.getDataObjectDeserializer().getObject().orElse(null);

            if (stripeObject == null) {
                return "Ignored event without payload";
            }

            if ("checkout.session.completed".equals(event.getType()) && stripeObject instanceof Session session) {
                markPaymentSucceeded(session);
            }

            if ("checkout.session.expired".equals(event.getType()) && stripeObject instanceof Session session) {
                markPaymentCanceled(session);
            }

            return "Webhook processed";
        } catch (Exception exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Webhook Stripe invalide: " + exception.getMessage(), exception);
        }
    }

    public List<SubscriptionPaymentResponseDTO> getAllPaymentHistory() {
        return subscriptionPaymentRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<SubscriptionPaymentResponseDTO> getPaymentHistoryByUser(String userId) {
        return subscriptionPaymentRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private void markPaymentSucceeded(Session session) {
        SubscriptionPayment payment = resolvePaymentFromSession(session);
        if (payment == null || payment.getStatus() == SubscriptionPaymentStatus.SUCCESS) {
            return;
        }

        payment.setStatus(SubscriptionPaymentStatus.SUCCESS);
        payment.setProvider("STRIPE");
        payment.setStripePaymentIntentId(session.getPaymentIntent());
        payment.setTransactionReference(
                StringUtils.hasText(session.getPaymentIntent()) ? session.getPaymentIntent() : session.getId()
        );
        payment.setPaidAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        payment.setFailureReason(null);
        subscriptionPaymentRepository.save(payment);

        Subscription subscription = subscriptionRepository.findById(payment.getSubscriptionId())
                .orElseThrow(() -> new RuntimeException("Abonnement lie au paiement introuvable"));
        SubscriptionPlan plan = subscriptionPlanRepository.findById(subscription.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan lie au paiement introuvable"));

        LocalDateTime startDate = LocalDateTime.now();
        subscription.setStatus("ACTIVE");
        subscription.setStartDate(startDate);
        subscription.setEndDate(startDate.plusDays(plan.getDurationDays()));
        subscription.setUpdatedAt(LocalDateTime.now());
        subscriptionRepository.save(subscription);
    }

    private void markPaymentCanceled(Session session) {
        SubscriptionPayment payment = resolvePaymentFromSession(session);
        if (payment == null || payment.getStatus() == SubscriptionPaymentStatus.SUCCESS) {
            return;
        }

        payment.setStatus(SubscriptionPaymentStatus.CANCELED);
        payment.setFailureReason("La session Stripe a expire");
        payment.setUpdatedAt(LocalDateTime.now());
        subscriptionPaymentRepository.save(payment);

        subscriptionRepository.findById(payment.getSubscriptionId()).ifPresent(subscription -> {
            if (!"ACTIVE".equals(subscription.getStatus())) {
                subscription.setStatus("CANCELED");
                subscription.setUpdatedAt(LocalDateTime.now());
                subscriptionRepository.save(subscription);
            }
        });
    }

    private SubscriptionPayment resolvePaymentFromSession(Session session) {
        if (StringUtils.hasText(session.getId())) {
            return subscriptionPaymentRepository.findByStripeSessionId(session.getId()).orElseGet(() -> findPaymentByMetadata(session));
        }
        return findPaymentByMetadata(session);
    }

    private SubscriptionPayment findPaymentByMetadata(Session session) {
        Map<String, String> metadata = session.getMetadata();
        if (metadata == null || !StringUtils.hasText(metadata.get("paymentId"))) {
            return null;
        }
        return subscriptionPaymentRepository.findById(metadata.get("paymentId")).orElse(null);
    }

    private Subscription buildPendingSubscription(String userId, SubscriptionPlan plan) {
        Subscription subscription = new Subscription();
        subscription.setUserId(userId);
        subscription.setPlanId(plan.getId());
        subscription.setStatus("PENDING");
        subscription.setSubscriptionNumber(generateSubscriptionNumber());
        subscription.setCreatedAt(LocalDateTime.now());
        subscription.setUpdatedAt(LocalDateTime.now());
        return subscription;
    }

    private SubscriptionPayment buildPendingPayment(String userId, SubscriptionPlan plan, Subscription subscription) {
        SubscriptionPayment payment = new SubscriptionPayment();
        payment.setUserId(userId);
        payment.setPlanId(plan.getId());
        payment.setPlanName(plan.getName());
        payment.setSubscriptionId(subscription.getId());
        payment.setSubscriptionNumber(subscription.getSubscriptionNumber());
        payment.setAmount(plan.getPrice());
        payment.setCurrency(stripeCurrency.toUpperCase());
        payment.setProvider("STRIPE");
        payment.setStatus(SubscriptionPaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        return payment;
    }

    private SessionCreateParams buildSessionParams(
            SubscriptionCheckoutRequestDTO request,
            SubscriptionPlan plan,
            SubscriptionPayment payment,
            Subscription subscription
    ) {
        return SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(appendSessionIdPlaceholder(request.getSuccessUrl()))
                .setCancelUrl(request.getCancelUrl())
                .putMetadata("paymentId", payment.getId())
                .putMetadata("subscriptionId", subscription.getId())
                .putMetadata("planId", plan.getId())
                .putMetadata("userId", request.getUserId())
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency(stripeCurrency)
                                                .setUnitAmount(convertAmountToMinorUnit(plan.getPrice()))
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(plan.getName())
                                                                .setDescription(buildPlanDescription(plan))
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();
    }

    private SubscriptionPaymentResponseDTO toResponse(SubscriptionPayment payment) {
        SubscriptionPaymentResponseDTO dto = new SubscriptionPaymentResponseDTO();
        dto.setPaymentId(payment.getId());
        dto.setUserId(payment.getUserId());
        dto.setPlanId(payment.getPlanId());
        dto.setPlanName(payment.getPlanName());
        dto.setSubscriptionId(payment.getSubscriptionId());
        dto.setSubscriptionNumber(payment.getSubscriptionNumber());
        dto.setAmount(payment.getAmount());
        dto.setCurrency(payment.getCurrency());
        dto.setProvider(payment.getProvider());
        dto.setStatus(payment.getStatus() != null ? payment.getStatus().name() : null);
        dto.setTransactionReference(payment.getTransactionReference());
        dto.setFailureReason(payment.getFailureReason());
        dto.setCreatedAt(payment.getCreatedAt());
        dto.setUpdatedAt(payment.getUpdatedAt());
        dto.setPaidAt(payment.getPaidAt());
        return dto;
    }

    private void validateCheckoutRequest(SubscriptionCheckoutRequestDTO request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La requete de paiement est invalide");
        }
        if (!StringUtils.hasText(request.getUserId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le userId est obligatoire");
        }
        if (!StringUtils.hasText(request.getPlanId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le planId est obligatoire");
        }
        if (!StringUtils.hasText(request.getSuccessUrl()) || !StringUtils.hasText(request.getCancelUrl())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Les URL de retour Stripe sont obligatoires");
        }
    }

    private void ensureStripeSecretConfigured() {
        if (!StringUtils.hasText(stripeSecretKey)) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "La cle Stripe n'est pas configuree. Renseignez STRIPE_SECRET_KEY."
            );
        }
    }

    private String appendSessionIdPlaceholder(String successUrl) {
        String separator = successUrl.contains("?") ? "&" : "?";
        return successUrl + separator + "session_id={CHECKOUT_SESSION_ID}";
    }

    private long convertAmountToMinorUnit(Double amount) {
        return Math.round((amount != null ? amount : 0D) * 100);
    }

    private String buildPlanDescription(SubscriptionPlan plan) {
        return String.format(
                "%s - %s jours%s",
                plan.getDescription() != null ? plan.getDescription() : "Abonnement Aletheia",
                plan.getDurationDays(),
                plan.getCertificationIncluded() != null && plan.getCertificationIncluded() ? " - certification incluse" : ""
        );
    }

    private String generateSubscriptionNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "SUB-" + timestamp + "-" + random;
    }
}
