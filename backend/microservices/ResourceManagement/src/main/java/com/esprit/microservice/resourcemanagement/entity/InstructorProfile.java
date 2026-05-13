package com.esprit.microservice.resourcemanagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "instructor_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InstructorProfile {

    @Id
    @Column(name = "instructor_id", length = 100)
    private String instructorId;

    @Column(name = "reputation_score", nullable = false)
    @Builder.Default
    private Integer reputationScore = 100;

    @Column(name = "total_reservations", nullable = false)
    @Builder.Default
    private Integer totalReservations = 0;

    @Column(name = "no_show_count", nullable = false)
    @Builder.Default
    private Integer noShowCount = 0;

    @Column(name = "late_cancellation_count", nullable = false)
    @Builder.Default
    private Integer lateCancellationCount = 0;

    @Column(name = "is_trusted", nullable = false)
    @Builder.Default
    private Boolean isTrusted = false;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        lastUpdated = LocalDateTime.now();
        isTrusted = reputationScore != null && reputationScore >= 80;
    }

    public void adjustScore(int delta) {
        reputationScore = Math.max(0, Math.min(100, reputationScore + delta));
        isTrusted = reputationScore >= 80;
    }

    public boolean canAutoConfirmApprovalRequired() {
        return reputationScore != null && reputationScore >= 90;
    }
}
