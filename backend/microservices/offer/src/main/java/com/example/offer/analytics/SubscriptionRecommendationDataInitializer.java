package com.example.offer.analytics;

import com.example.offer.model.Subscription;
import com.example.offer.model.SubscriptionPayment;
import com.example.offer.model.SubscriptionPaymentStatus;
import com.example.offer.model.SubscriptionPlan;
import com.example.offer.repository.SubscriptionPaymentRepository;
import com.example.offer.repository.SubscriptionPlanRepository;
import com.example.offer.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SubscriptionRecommendationDataInitializer implements CommandLineRunner {

    private final SubscriptionPlanRepository planRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionPaymentRepository paymentRepository;

    @Override
    public void run(String... args) {
        List<SubscriptionPlan> plans = ensurePlans();

        boolean hasSuccessfulPayments = paymentRepository.findAll().stream()
                .anyMatch(payment -> payment.getStatus() == SubscriptionPaymentStatus.SUCCESS);

        if (hasSuccessfulPayments) {
            System.out.println("Subscription recommendation demo data already present with successful payments.");
            return;
        }

        System.out.println("Adding subscription recommendation demo data with successful histories...");

        SubscriptionPlan basic = plans.get(0);
        SubscriptionPlan standard = plans.get(1);
        SubscriptionPlan premium = plans.get(2);

        List<Subscription> subscriptions = new ArrayList<>();
        List<SubscriptionPayment> payments = new ArrayList<>();

        createSuccessfulHistory("demo-loyal", basic, 120, subscriptions, payments);
        createSuccessfulHistory("demo-loyal", basic, 80, subscriptions, payments);
        createSuccessfulHistory("demo-loyal", basic, 40, subscriptions, payments);

        createCanceledHistory("demo-budget", premium, 95, subscriptions, payments);
        createFailedHistory("demo-budget", premium, 55, subscriptions, payments);
        createSuccessfulHistory("demo-budget", standard, 20, subscriptions, payments);

        createSuccessfulHistory("demo-upgrade", standard, 100, subscriptions, payments);
        createSuccessfulHistory("demo-upgrade", premium, 60, subscriptions, payments);
        createSuccessfulHistory("demo-upgrade", premium, 25, subscriptions, payments);

        subscriptionRepository.saveAll(subscriptions);
        paymentRepository.saveAll(payments);

        System.out.println("Subscription recommendation demo data inserted: " + subscriptions.size() + " subscriptions, " + payments.size() + " payments.");
    }

    private List<SubscriptionPlan> ensurePlans() {
        List<SubscriptionPlan> existing = planRepository.findByIsActiveTrueOrderByPriceAsc();
        if (existing.size() >= 3) {
            return existing;
        }

        List<SubscriptionPlan> plans = new ArrayList<>();
        if (existing.isEmpty()) {
            plans.add(buildPlan("Basic Monthly", "Starter access for light learners", 9.99, 30, 5, false));
            plans.add(buildPlan("Standard Monthly", "Balanced plan for regular learners", 19.99, 30, 12, true));
            plans.add(buildPlan("Premium Monthly", "Unlimited learning for power users", 29.99, 30, null, true));
            return planRepository.saveAll(plans);
        }

        return existing;
    }

    private SubscriptionPlan buildPlan(
            String name,
            String description,
            double price,
            int durationDays,
            Integer maxCourses,
            boolean certificationIncluded
    ) {
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setName(name);
        plan.setDescription(description);
        plan.setPrice(price);
        plan.setDurationDays(durationDays);
        plan.setMaxCourses(maxCourses);
        plan.setCertificationIncluded(certificationIncluded);
        plan.setIsActive(true);
        plan.setCreatedAt(LocalDateTime.now());
        plan.setUpdatedAt(LocalDateTime.now());
        return plan;
    }

    private void createSuccessfulHistory(
            String userId,
            SubscriptionPlan plan,
            int daysAgo,
            List<Subscription> subscriptions,
            List<SubscriptionPayment> payments
    ) {
        createHistory(userId, plan, daysAgo, "ACTIVE", SubscriptionPaymentStatus.SUCCESS, subscriptions, payments, null);
    }

    private void createFailedHistory(
            String userId,
            SubscriptionPlan plan,
            int daysAgo,
            List<Subscription> subscriptions,
            List<SubscriptionPayment> payments
    ) {
        createHistory(userId, plan, daysAgo, "PENDING", SubscriptionPaymentStatus.FAILED, subscriptions, payments, "Payment attempt failed");
    }

    private void createCanceledHistory(
            String userId,
            SubscriptionPlan plan,
            int daysAgo,
            List<Subscription> subscriptions,
            List<SubscriptionPayment> payments
    ) {
        createHistory(userId, plan, daysAgo, "CANCELED", SubscriptionPaymentStatus.CANCELED, subscriptions, payments, "Subscription canceled quickly");
    }

    private void createHistory(
            String userId,
            SubscriptionPlan plan,
            int daysAgo,
            String subscriptionStatus,
            SubscriptionPaymentStatus paymentStatus,
            List<Subscription> subscriptions,
            List<SubscriptionPayment> payments,
            String failureReason
    ) {
        LocalDateTime createdAt = LocalDateTime.now().minusDays(daysAgo);

        Subscription subscription = new Subscription();
        subscription.setId(UUID.randomUUID().toString());
        subscription.setUserId(userId);
        subscription.setPlanId(plan.getId());
        subscription.setSubscriptionNumber(generateSubscriptionNumber(createdAt));
        subscription.setCreatedAt(createdAt);
        subscription.setUpdatedAt(createdAt.plusDays(1));
        subscription.setStartDate(createdAt);
        subscription.setEndDate(createdAt.plusDays(plan.getDurationDays()));
        subscription.setStatus(subscriptionStatus);
        subscriptions.add(subscription);

        SubscriptionPayment payment = new SubscriptionPayment();
        payment.setId(UUID.randomUUID().toString());
        payment.setUserId(userId);
        payment.setPlanId(plan.getId());
        payment.setPlanName(plan.getName());
        payment.setSubscriptionId(subscription.getId());
        payment.setSubscriptionNumber(subscription.getSubscriptionNumber());
        payment.setAmount(plan.getPrice());
        payment.setCurrency("EUR");
        payment.setProvider("STRIPE");
        payment.setStatus(paymentStatus);
        payment.setTransactionReference(paymentStatus == SubscriptionPaymentStatus.SUCCESS ? "pi_" + UUID.randomUUID().toString().replace("-", "") : null);
        payment.setFailureReason(failureReason);
        payment.setCreatedAt(createdAt);
        payment.setUpdatedAt(createdAt.plusHours(2));
        payment.setPaidAt(paymentStatus == SubscriptionPaymentStatus.SUCCESS ? createdAt.plusHours(2) : null);
        payments.add(payment);
    }

    private String generateSubscriptionNumber(LocalDateTime createdAt) {
        String timestamp = createdAt.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "SUB-DEMO-" + timestamp + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
