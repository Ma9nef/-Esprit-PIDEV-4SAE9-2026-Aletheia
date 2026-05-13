package com.esprit.microservice.resourcemanagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "resource_availability", indexes = {
        @Index(name = "idx_availability_resource", columnList = "resource_id"),
        @Index(name = "idx_availability_time", columnList = "resource_id, start_time, end_time")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "resource_id", nullable = false)
    private UUID resourceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resource_id", insertable = false, updatable = false)
    private Resource resource;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
