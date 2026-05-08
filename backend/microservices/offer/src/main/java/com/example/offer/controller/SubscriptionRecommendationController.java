package com.example.offer.controller;

import com.example.offer.dto.RecommendationTrainingRowDTO;
import com.example.offer.service.SubscriptionRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/subscription-recommendations")
@RequiredArgsConstructor
public class SubscriptionRecommendationController {

    private final SubscriptionRecommendationService recommendationService;

    @GetMapping("/dataset")
    public ResponseEntity<List<RecommendationTrainingRowDTO>> getTrainingDataset() {
        return ResponseEntity.ok(recommendationService.exportTrainingDataset());
    }

    @GetMapping(value = "/dataset.csv", produces = "text/csv")
    public ResponseEntity<String> getTrainingDatasetCsv() {
        List<RecommendationTrainingRowDTO> rows = recommendationService.exportTrainingDataset();

        StringBuilder csv = new StringBuilder();
        csv.append("userId,labelPlanId,lastPlanId,mostRenewedPlanId,totalSubscriptions,renewalCount,cancelCount,")
                .append("expiredWithoutRenewalCount,successfulPaymentsCount,failedPaymentsCount,canceledPaymentsCount,")
                .append("paymentSuccessRate,averageDaysBetweenSubscriptions,loyalCustomer,fastCancellationProfile\n");

        rows.forEach(row -> csv.append(safe(row.getUserId())).append(",")
                .append(safe(row.getLabelPlanId())).append(",")
                .append(safe(row.getLastPlanId())).append(",")
                .append(safe(row.getMostRenewedPlanId())).append(",")
                .append(safe(row.getTotalSubscriptions())).append(",")
                .append(safe(row.getRenewalCount())).append(",")
                .append(safe(row.getCancelCount())).append(",")
                .append(safe(row.getExpiredWithoutRenewalCount())).append(",")
                .append(safe(row.getSuccessfulPaymentsCount())).append(",")
                .append(safe(row.getFailedPaymentsCount())).append(",")
                .append(safe(row.getCanceledPaymentsCount())).append(",")
                .append(safe(row.getPaymentSuccessRate())).append(",")
                .append(safe(row.getAverageDaysBetweenSubscriptions())).append(",")
                .append(safe(row.getLoyalCustomer())).append(",")
                .append(safe(row.getFastCancellationProfile())).append("\n"));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=recommendation-dataset.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.toString());
    }

    private String safe(Object value) {
        return value == null ? "" : String.valueOf(value);
    }
}
