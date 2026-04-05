package com.example.offer.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.offer.dto.RecommendationFeaturesDTO;
import com.example.offer.dto.RecommendationTrainingRowDTO;
import com.example.offer.dto.SubscriptionPlanRecommendationDTO;
import com.example.offer.model.Subscription;
import com.example.offer.model.SubscriptionPayment;
import com.example.offer.model.SubscriptionPaymentStatus;
import com.example.offer.model.SubscriptionPlan;
import com.example.offer.repository.SubscriptionPaymentRepository;
import com.example.offer.repository.SubscriptionPlanRepository;
import com.example.offer.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SubscriptionRecommendationService {

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionPaymentRepository subscriptionPaymentRepository;
    private final ObjectMapper objectMapper;

    @Value("${recommendation.ml.enabled:true}")
    private boolean mlEnabled;

    @Value("${recommendation.ml.python-command:python}")
    private String mlPythonCommand;

    @Value("${recommendation.ml.script-path:ml/predict_recommendation.py}")
    private String mlScriptPath;

    @Value("${recommendation.ml.model-path:ml/subscription_recommendation_model.joblib}")
    private String mlModelPath;

    public SubscriptionPlanRecommendationDTO recommendPlanForUser(String userId) {
        List<SubscriptionPlan> activePlans = subscriptionPlanRepository.findByIsActiveTrueOrderByPriceAsc();
        if (activePlans.isEmpty()) {
            throw new RuntimeException("Aucun plan actif disponible pour la recommandation");
        }

        UserHistorySnapshot history = loadUserHistory(userId);

        RecommendationFeaturesDTO features = buildFeatures(history.subscriptions(), history.payments());
        RecommendationDecision decision = recommendWithModel(activePlans, features);
        if (decision == null) {
            decision = decideRecommendation(activePlans, history.subscriptions(), history.payments(), features);
        }

        SubscriptionPlanRecommendationDTO dto = new SubscriptionPlanRecommendationDTO();
        dto.setSuccess(true);
        dto.setMessage("Recommendation generated successfully");
        dto.setUserId(userId);
        dto.setRecommendedPlanId(decision.plan().getId());
        dto.setRecommendedPlanName(decision.plan().getName());
        dto.setRecommendedPlanPrice(decision.plan().getPrice());
        dto.setConfidenceScore(decision.confidenceScore());
        dto.setRecommendationType(decision.recommendationType());
        dto.setReasons(decision.reasons());
        dto.setFeatures(features);
        return dto;
    }

    public List<RecommendationTrainingRowDTO> exportTrainingDataset() {
        return subscriptionRepository.findAll().stream()
                .map(Subscription::getUserId)
                .filter(Objects::nonNull)
                .distinct()
                .map(this::buildTrainingRow)
                .filter(Objects::nonNull)
                .toList();
    }

    private RecommendationTrainingRowDTO buildTrainingRow(String userId) {
        UserHistorySnapshot history = loadUserHistory(userId);
        if (history.subscriptions().isEmpty()) {
            return null;
        }

        RecommendationFeaturesDTO features = buildFeatures(history.subscriptions(), history.payments());
        Subscription lastSuccessfulSubscription = findLastSuccessfulSubscription(history.subscriptions(), history.payments());
        if (lastSuccessfulSubscription == null || lastSuccessfulSubscription.getPlanId() == null) {
            return null;
        }

        return RecommendationTrainingRowDTO.builder()
                .userId(userId)
                .labelPlanId(lastSuccessfulSubscription.getPlanId())
                .lastPlanId(features.getLastPlanId())
                .mostRenewedPlanId(features.getMostRenewedPlanId())
                .totalSubscriptions(features.getTotalSubscriptions())
                .renewalCount(features.getRenewalCount())
                .cancelCount(features.getCancelCount())
                .expiredWithoutRenewalCount(features.getExpiredWithoutRenewalCount())
                .successfulPaymentsCount(features.getSuccessfulPaymentsCount())
                .failedPaymentsCount(features.getFailedPaymentsCount())
                .canceledPaymentsCount(features.getCanceledPaymentsCount())
                .paymentSuccessRate(features.getPaymentSuccessRate())
                .averageDaysBetweenSubscriptions(features.getAverageDaysBetweenSubscriptions())
                .loyalCustomer(features.getLoyalCustomer())
                .fastCancellationProfile(features.getFastCancellationProfile())
                .build();
    }

    private RecommendationFeaturesDTO buildFeatures(List<Subscription> subscriptions, List<SubscriptionPayment> payments) {
        RecommendationFeaturesDTO features = new RecommendationFeaturesDTO();
        features.setTotalSubscriptions(subscriptions.size());

        Subscription lastSubscription = subscriptions.isEmpty() ? null : subscriptions.get(subscriptions.size() - 1);
        features.setLastPlanId(lastSubscription != null ? lastSubscription.getPlanId() : null);

        Map<String, Long> subscriptionsByPlan = subscriptions.stream()
                .filter(subscription -> subscription.getPlanId() != null)
                .collect(Collectors.groupingBy(Subscription::getPlanId, Collectors.counting()));

        String mostRenewedPlanId = subscriptionsByPlan.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
        features.setMostRenewedPlanId(mostRenewedPlanId);

        long renewalCount = subscriptionsByPlan.values().stream()
                .mapToLong(count -> Math.max(0, count - 1))
                .sum();
        features.setRenewalCount((int) renewalCount);

        int cancelCount = (int) subscriptions.stream().filter(subscription -> "CANCELED".equals(subscription.getStatus())).count();
        int expiredWithoutRenewalCount = (int) subscriptions.stream().filter(subscription -> "EXPIRED".equals(subscription.getStatus())).count();
        features.setCancelCount(cancelCount);
        features.setExpiredWithoutRenewalCount(expiredWithoutRenewalCount);

        int successfulPayments = (int) payments.stream().filter(payment -> payment.getStatus() == SubscriptionPaymentStatus.SUCCESS).count();
        int failedPayments = (int) payments.stream().filter(payment -> payment.getStatus() == SubscriptionPaymentStatus.FAILED).count();
        int canceledPayments = (int) payments.stream().filter(payment -> payment.getStatus() == SubscriptionPaymentStatus.CANCELED).count();
        features.setSuccessfulPaymentsCount(successfulPayments);
        features.setFailedPaymentsCount(failedPayments);
        features.setCanceledPaymentsCount(canceledPayments);

        int totalPayments = successfulPayments + failedPayments + canceledPayments;
        features.setPaymentSuccessRate(totalPayments == 0 ? 0D : (double) successfulPayments / totalPayments);

        if (subscriptions.size() >= 2) {
            List<Long> dayDiffs = new ArrayList<>();
            for (int index = 1; index < subscriptions.size(); index++) {
                LocalDateTime previous = subscriptions.get(index - 1).getCreatedAt();
                LocalDateTime current = subscriptions.get(index).getCreatedAt();
                if (previous != null && current != null) {
                    dayDiffs.add(Math.abs(Duration.between(previous, current).toDays()));
                }
            }
            double average = dayDiffs.isEmpty()
                    ? 0D
                    : dayDiffs.stream().mapToLong(Long::longValue).average().orElse(0D);
            features.setAverageDaysBetweenSubscriptions(average);
        } else {
            features.setAverageDaysBetweenSubscriptions(0D);
        }

        features.setLoyalCustomer(features.getRenewalCount() >= 2 && features.getPaymentSuccessRate() >= 0.7);
        features.setFastCancellationProfile(cancelCount > 0 && cancelCount >= successfulPayments);
        return features;
    }

    private RecommendationDecision recommendWithModel(List<SubscriptionPlan> activePlans, RecommendationFeaturesDTO features) {
        if (!mlEnabled) {
            return null;
        }

        Path scriptPath = resolveMlPath(mlScriptPath);
        Path modelPath = resolveMlPath(mlModelPath);
        if (scriptPath == null || modelPath == null) {
            log.info("ML recommendation disabled because script or model path could not be resolved.");
            return null;
        }

        Map<String, SubscriptionPlan> planById = activePlans.stream()
                .collect(Collectors.toMap(SubscriptionPlan::getId, Function.identity()));

        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                    mlPythonCommand,
                    scriptPath.toString(),
                    modelPath.toString()
            );
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();
            try (Writer writer = new OutputStreamWriter(process.getOutputStream(), StandardCharsets.UTF_8)) {
                writer.write(objectMapper.writeValueAsString(buildModelPayload(features)));
            }

            boolean finished = process.waitFor(20, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                log.warn("ML recommendation timed out, falling back to heuristic recommendation.");
                return null;
            }

            String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8).trim();
            if (process.exitValue() != 0 || output.isBlank()) {
                log.warn("ML recommendation failed with exit code {} and output: {}", process.exitValue(), output);
                return null;
            }

            ModelPredictionResult prediction = objectMapper.readValue(output, ModelPredictionResult.class);
            if (prediction.predictedPlanId() == null) {
                return null;
            }

            SubscriptionPlan predictedPlan = planById.get(prediction.predictedPlanId());
            if (predictedPlan == null) {
                log.warn("ML recommendation predicted an inactive or unknown plan: {}", prediction.predictedPlanId());
                return null;
            }

            List<String> reasons = new ArrayList<>();
            reasons.add("This recommendation was generated by a Random Forest model trained on subscription history.");
            reasons.add("The model considered renewals, payment success rate, cancellations, and plan usage patterns.");

            int confidence = prediction.confidenceScore() != null
                    ? prediction.confidenceScore()
                    : 82;

            return new RecommendationDecision(predictedPlan, confidence, "ML_RANDOM_FOREST", reasons);
        } catch (IOException | InterruptedException exception) {
            if (exception instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            log.warn("ML recommendation unavailable, falling back to heuristic recommendation.", exception);
            return null;
        }
    }

    private Map<String, Object> buildModelPayload(RecommendationFeaturesDTO features) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("lastPlanId", features.getLastPlanId());
        payload.put("mostRenewedPlanId", features.getMostRenewedPlanId());
        payload.put("totalSubscriptions", features.getTotalSubscriptions());
        payload.put("renewalCount", features.getRenewalCount());
        payload.put("cancelCount", features.getCancelCount());
        payload.put("expiredWithoutRenewalCount", features.getExpiredWithoutRenewalCount());
        payload.put("successfulPaymentsCount", features.getSuccessfulPaymentsCount());
        payload.put("failedPaymentsCount", features.getFailedPaymentsCount());
        payload.put("canceledPaymentsCount", features.getCanceledPaymentsCount());
        payload.put("paymentSuccessRate", features.getPaymentSuccessRate());
        payload.put("averageDaysBetweenSubscriptions", features.getAverageDaysBetweenSubscriptions());
        payload.put("loyalCustomer", features.getLoyalCustomer());
        payload.put("fastCancellationProfile", features.getFastCancellationProfile());
        return payload;
    }

    private Path resolveMlPath(String configuredPath) {
        Path path = Paths.get(configuredPath);
        if (path.isAbsolute() && Files.exists(path)) {
            return path;
        }

        Path currentDirectory = Paths.get(System.getProperty("user.dir"));
        Path currentRelative = currentDirectory.resolve(path).normalize();
        if (Files.exists(currentRelative)) {
            return currentRelative;
        }

        Path workspaceRelative = currentDirectory.resolve("backend").resolve("offer").resolve(path).normalize();
        if (Files.exists(workspaceRelative)) {
            return workspaceRelative;
        }

        return null;
    }

    private UserHistorySnapshot loadUserHistory(String userId) {
        List<Subscription> subscriptions = subscriptionRepository.findByUserId(userId).stream()
                .sorted(Comparator.comparing(Subscription::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
        List<SubscriptionPayment> payments = subscriptionPaymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return new UserHistorySnapshot(subscriptions, payments);
    }

    private RecommendationDecision decideRecommendation(
            List<SubscriptionPlan> activePlans,
            List<Subscription> subscriptions,
            List<SubscriptionPayment> payments,
            RecommendationFeaturesDTO features
    ) {
        Map<String, SubscriptionPlan> planById = activePlans.stream()
                .collect(Collectors.toMap(SubscriptionPlan::getId, Function.identity()));

        List<String> reasons = new ArrayList<>();

        if (Boolean.TRUE.equals(features.getLoyalCustomer()) && features.getMostRenewedPlanId() != null) {
            SubscriptionPlan preferredPlan = planById.get(features.getMostRenewedPlanId());
            if (preferredPlan != null) {
                reasons.add("This plan is the one you renewed most often.");
                reasons.add("Your payment history shows a strong success rate and loyal usage.");
                return new RecommendationDecision(preferredPlan, 92, "LOYALTY_RENEWAL", reasons);
            }
        }

        if (Boolean.TRUE.equals(features.getFastCancellationProfile()) || features.getPaymentSuccessRate() < 0.5) {
            SubscriptionPlan cheapestPlan = activePlans.get(0);
            reasons.add("You have cancellations or unsuccessful payments on previous subscriptions.");
            reasons.add("A more flexible and lower-cost plan is safer for your next subscription.");
            return new RecommendationDecision(cheapestPlan, 84, "FLEXIBLE_BUDGET", reasons);
        }

        Subscription lastSubscription = subscriptions.isEmpty() ? null : subscriptions.get(subscriptions.size() - 1);
        if (lastSubscription != null && lastSubscription.getPlanId() != null) {
            SubscriptionPlan lastPlan = planById.get(lastSubscription.getPlanId());
            if (lastPlan != null) {
                boolean hadRecentSuccess = payments.stream()
                        .anyMatch(payment -> payment.getStatus() == SubscriptionPaymentStatus.SUCCESS
                                && lastSubscription.getId() != null
                                && lastSubscription.getId().equals(payment.getSubscriptionId()));
                if (hadRecentSuccess) {
                    reasons.add("Your last subscription on this plan was paid successfully.");
                    reasons.add("You already have a stable history with this plan.");
                    return new RecommendationDecision(lastPlan, 78, "PREVIOUS_SUCCESS", reasons);
                }
            }
        }

        SubscriptionPlan balancedPlan = activePlans.get(Math.min(1, activePlans.size() - 1));
        reasons.add("This plan offers a balanced recommendation based on your subscription and payment history.");
        reasons.add("It is selected as a neutral option while more usage data is collected for machine learning.");
        return new RecommendationDecision(balancedPlan, 65, "BALANCED_DEFAULT", reasons);
    }

    private Subscription findLastSuccessfulSubscription(List<Subscription> subscriptions, List<SubscriptionPayment> payments) {
        return subscriptions.stream()
                .filter(subscription -> payments.stream().anyMatch(payment ->
                        payment.getStatus() == SubscriptionPaymentStatus.SUCCESS
                                && subscription.getId() != null
                                && subscription.getId().equals(payment.getSubscriptionId())))
                .reduce((first, second) -> second)
                .orElse(null);
    }

    private record RecommendationDecision(
            SubscriptionPlan plan,
            int confidenceScore,
            String recommendationType,
            List<String> reasons
    ) {
    }

    private record UserHistorySnapshot(
            List<Subscription> subscriptions,
            List<SubscriptionPayment> payments
    ) {
    }

    private record ModelPredictionResult(
            String predictedPlanId,
            Integer confidenceScore
    ) {
    }
}
