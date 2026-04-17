package com.esprit.microservice.resourcemanagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "checkin_events", indexes = {
        @Index(name = "idx_checkin_reservation", columnList = "reservation_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CheckInEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "reservation_id", nullable = false)
    private UUID reservationId;

    @Column(name = "scanned_at", nullable = false)
    private LocalDateTime scannedAt;

    @Column(name = "token_used", nullable = false, length = 100)
    private String tokenUsed;

    @Column(nullable = false)
    @Builder.Default
    private Boolean valid = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
