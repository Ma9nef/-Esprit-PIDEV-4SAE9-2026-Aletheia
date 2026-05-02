package com.esprit.microservice.resourcemanagement.service;

import com.esprit.microservice.resourcemanagement.entity.Reservation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Publishes reservation lifecycle events to Kafka.
 * KafkaTemplate is optional — when Kafka is not configured or disabled,
 * events are only logged.
 *
 * This component is also optional via @Autowired(required = false) in
 * dependent services, so the app can start even if Kafka is disabled.
 */
@Slf4j
@Component
public class ReservationEventPublisher {

    // Optional injection — won't fail startup if Kafka is not configured
    @Autowired(required = false)
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${app.kafka.topic.reservation-events:reservation-events}")
    private String topic;

    @Value("${app.kafka.enabled:false}")
    private boolean kafkaEnabled;

    public void publishReservationCreated(Reservation reservation) {
        publish("RESERVATION_CREATED", reservation);
    }

    public void publishReservationConfirmed(Reservation reservation) {
        publish("RESERVATION_CONFIRMED", reservation);
    }

    public void publishReservationCancelled(Reservation reservation) {
        publish("RESERVATION_CANCELLED", reservation);
    }

    private void publish(String eventType, Reservation reservation) {
        if (!kafkaEnabled || kafkaTemplate == null) {
            log.debug("Kafka disabled. Would publish {} for reservation={}", eventType, reservation.getId());
            return;
        }

        Map<String, Object> event = Map.of(
                "eventType", eventType,
                "reservationId", reservation.getId().toString(),
                "resourceId", reservation.getResourceId().toString(),
                "eventId", reservation.getEventId(),
                "startTime", reservation.getStartTime().toString(),
                "endTime", reservation.getEndTime().toString(),
                "status", reservation.getStatus().name(),
                "timestamp", LocalDateTime.now().toString()
        );

        try {
            kafkaTemplate.send(topic, reservation.getResourceId().toString(), event);
            log.info("Published {} event for reservation={}", eventType, reservation.getId());
        } catch (Exception e) {
            log.error("Failed to publish {} event for reservation={}: {}",
                    eventType, reservation.getId(), e.getMessage());
        }
    }
}
