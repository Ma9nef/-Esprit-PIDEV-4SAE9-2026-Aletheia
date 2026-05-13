package com.esprit.microservice.resourcemanagement.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Publishes resource-management domain events to Kafka.
 * If Kafka is disabled (app.kafka.enabled=false) all publish calls are no-ops.
 */
@Slf4j
@Service
public class KafkaEventPublisher {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final boolean enabled;

    @Autowired
    public KafkaEventPublisher(
            @Autowired(required = false) KafkaTemplate<String, Object> kafkaTemplate,
            @Value("${app.kafka.enabled:false}") boolean enabled) {
        this.kafkaTemplate = kafkaTemplate;
        this.enabled = enabled && kafkaTemplate != null;
    }

    public void publish(String topic, Map<String, Object> payload) {
        if (!enabled) {
            log.debug("Kafka disabled — skipping event on topic '{}'", topic);
            return;
        }
        try {
            String key = payload.getOrDefault("reservationId", "event").toString();
            String value = toJson(payload);
            kafkaTemplate.send(topic, key, value);
            log.debug("Published event to '{}': {}", topic, value);
        } catch (Exception e) {
            log.warn("Failed to publish Kafka event to '{}': {}", topic, e.getMessage());
        }
    }

    // ── convenience wrappers ──────────────────────────────────────────────

    public void reservationCreated(String reservationId, String instructorId,
                                   String resourceId, String startTime, String endTime) {
        publish("rm.reservation.created", Map.of(
                "reservationId", reservationId,
                "instructorId", instructorId,
                "resourceId", resourceId,
                "startTime", startTime,
                "endTime", endTime
        ));
    }

    public void reservationConfirmed(String reservationId, String instructorId,
                                     String resourceId, String qrToken) {
        publish("rm.reservation.confirmed", Map.of(
                "reservationId", reservationId,
                "instructorId", instructorId,
                "resourceId", resourceId,
                "qrToken", qrToken
        ));
    }

    public void reservationRejected(String reservationId, String instructorId, String reason) {
        publish("rm.reservation.rejected", Map.of(
                "reservationId", reservationId,
                "instructorId", instructorId,
                "reason", reason != null ? reason : ""
        ));
    }

    public void reservationCancelled(String reservationId, String instructorId, String reason) {
        publish("rm.reservation.cancelled", Map.of(
                "reservationId", reservationId,
                "instructorId", instructorId,
                "reason", reason != null ? reason : ""
        ));
    }

    public void checkIn(String reservationId, String instructorId, String scannedAt) {
        publish("rm.reservation.checkin", Map.of(
                "reservationId", reservationId,
                "instructorId", instructorId,
                "scannedAt", scannedAt
        ));
    }

    public void noShowDetected(String reservationId, String instructorId, String resourceId) {
        publish("rm.noshow.detected", Map.of(
                "reservationId", reservationId,
                "instructorId", instructorId,
                "resourceId", resourceId
        ));
    }

    public void approvalNeeded(String reservationId, String resourceId, String instructorId) {
        publish("rm.approval.needed", Map.of(
                "reservationId", reservationId,
                "resourceId", resourceId,
                "instructorId", instructorId
        ));
    }

    public void swapRequested(String swapId, String requesterId, String targetId) {
        publish("rm.swap.requested", Map.of(
                "swapId", swapId,
                "requesterId", requesterId,
                "targetId", targetId
        ));
    }

    public void swapResolved(String swapId, String status, String requesterId, String targetId) {
        publish("rm.swap.resolved", Map.of(
                "swapId", swapId,
                "status", status,
                "requesterId", requesterId,
                "targetId", targetId
        ));
    }

    public void waitlistNotified(String waitlistEntryId, String instructorId, String resourceId) {
        publish("rm.waitlist.notified", Map.of(
                "waitlistEntryId", waitlistEntryId,
                "instructorId", instructorId,
                "resourceId", resourceId
        ));
    }

    public void resourceConditionAlert(String resourceId, String resourceName, int conditionScore) {
        publish("rm.resource.condition.alert", Map.of(
                "resourceId", resourceId,
                "resourceName", resourceName,
                "conditionScore", String.valueOf(conditionScore)
        ));
    }

    // ── private ───────────────────────────────────────────────────────────

    private String toJson(Map<String, Object> map) {
        StringBuilder sb = new StringBuilder("{");
        map.forEach((k, v) -> sb.append("\"").append(k).append("\":\"").append(v).append("\","));
        if (sb.charAt(sb.length() - 1) == ',') sb.deleteCharAt(sb.length() - 1);
        sb.append("}");
        return sb.toString();
    }
}
