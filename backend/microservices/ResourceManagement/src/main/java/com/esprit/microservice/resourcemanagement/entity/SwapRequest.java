package com.esprit.microservice.resourcemanagement.entity;

import com.esprit.microservice.resourcemanagement.entity.enums.SwapRequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "swap_requests", indexes = {
        @Index(name = "idx_swap_requester", columnList = "requester_id"),
        @Index(name = "idx_swap_target", columnList = "target_id"),
        @Index(name = "idx_swap_status", columnList = "status")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SwapRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "requester_id", nullable = false, length = 100)
    private String requesterId;

    @Column(name = "target_id", nullable = false, length = 100)
    private String targetId;

    @Column(name = "requester_reservation_id", nullable = false)
    private UUID requesterReservationId;

    @Column(name = "target_reservation_id", nullable = false)
    private UUID targetReservationId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private SwapRequestStatus status = SwapRequestStatus.PENDING;

    @Column(name = "requester_note", columnDefinition = "TEXT")
    private String requesterNote;

    @Column(name = "response_note", columnDefinition = "TEXT")
    private String responseNote;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        if (expiresAt == null) {
            expiresAt = LocalDateTime.now().plusHours(24);
        }
    }

    public boolean isExpired() {
        return status == SwapRequestStatus.PENDING
                && LocalDateTime.now().isAfter(expiresAt);
    }
}
