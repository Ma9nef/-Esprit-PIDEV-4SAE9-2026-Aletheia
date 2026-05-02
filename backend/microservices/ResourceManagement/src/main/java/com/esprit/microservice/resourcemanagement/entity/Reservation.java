package com.esprit.microservice.resourcemanagement.entity;

import com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reservations", indexes = {
        @Index(name = "idx_reservation_resource_time", columnList = "resource_id, start_time, end_time"),
        @Index(name = "idx_reservation_status", columnList = "status"),
        @Index(name = "idx_reservation_recurrence", columnList = "recurrence_group_id"),
        @Index(name = "idx_reservation_instructor", columnList = "instructor_id"),
        @Index(name = "idx_reservation_deleted", columnList = "deleted")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teaching_session_id", nullable = false)
    private TeachingSession teachingSession;

    @Column(name = "instructor_id", nullable = false, length = 100)
    private String instructorId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ReservationStatus status = ReservationStatus.PENDING;

    @Column(name = "recurrence_group_id")
    private UUID recurrenceGroupId;

    @Column(name = "qr_code_token", length = 100)
    private String qrCodeToken;

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @Column(name = "no_show")
    @Builder.Default
    private Boolean noShow = false;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "cancellation_reason", columnDefinition = "TEXT")
    private String cancellationReason;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Version
    @Column(nullable = false)
    private Long version;

    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isActive() {
        return !Boolean.TRUE.equals(deleted)
                && status != ReservationStatus.CANCELLED
                && status != ReservationStatus.REJECTED;
    }

    public boolean isPending() {
        return status == ReservationStatus.PENDING;
    }

    public boolean isConfirmed() {
        return status == ReservationStatus.CONFIRMED;
    }

    public boolean isExpired() {
        return status == ReservationStatus.PENDING
                && expiresAt != null
                && LocalDateTime.now().isAfter(expiresAt);
    }
}
