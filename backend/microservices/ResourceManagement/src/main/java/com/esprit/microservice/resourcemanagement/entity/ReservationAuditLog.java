package com.esprit.microservice.resourcemanagement.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "reservation_audit_logs", indexes = {
        @Index(name = "idx_audit_reservation", columnList = "reservation_id"),
        @Index(name = "idx_audit_performed_by", columnList = "performed_by")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReservationAuditLog {

    @Transient
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "reservation_id", nullable = false)
    private UUID reservationId;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(name = "old_status", length = 30)
    private String oldStatus;

    @Column(name = "new_status", length = 30)
    private String newStatus;

    @Column(name = "performed_by", length = 100)
    private String performedBy;

    @Column(name = "details_json", columnDefinition = "TEXT")
    private String detailsJson;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @PrePersist
    public void onCreate() {
        timestamp = LocalDateTime.now();
    }

    public void setDetails(Map<String, String> details) {
        try {
            detailsJson = OBJECT_MAPPER.writeValueAsString(details);
        } catch (JsonProcessingException e) {
            detailsJson = "{}";
        }
    }

    public Map<String, String> getDetails() {
        if (detailsJson == null) return Map.of();
        try {
            return OBJECT_MAPPER.readValue(detailsJson, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            return Map.of();
        }
    }
}
