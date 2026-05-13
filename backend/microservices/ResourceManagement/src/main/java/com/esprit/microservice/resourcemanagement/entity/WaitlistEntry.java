package com.esprit.microservice.resourcemanagement.entity;

import com.esprit.microservice.resourcemanagement.entity.enums.WaitlistStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "waitlist_entries", indexes = {
        @Index(name = "idx_waitlist_resource", columnList = "resource_id"),
        @Index(name = "idx_waitlist_instructor", columnList = "instructor_id"),
        @Index(name = "idx_waitlist_status", columnList = "status")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WaitlistEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "resource_id", nullable = false)
    private UUID resourceId;

    @Column(name = "instructor_id", nullable = false, length = 100)
    private String instructorId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    @Builder.Default
    private Integer position = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private WaitlistStatus status = WaitlistStatus.WAITING;

    @Column(name = "notified_at")
    private LocalDateTime notifiedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
