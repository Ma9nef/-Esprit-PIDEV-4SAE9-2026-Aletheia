package com.esprit.microservice.resourcemanagement.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "reservation_audit_log", indexes = {
        @Index(name = "idx_audit_reservation", columnList = "reservation_id"),
        @Index(name = "idx_audit_performed_at", columnList = "performed_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationAuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reservation_id", nullable = false)
    private UUID reservationId;

    @Column(nullable = false, length = 50)
    private String action;

    @Column(name = "old_status", length = 50)
    private String oldStatus;

    @Column(name = "new_status", length = 50)
    private String newStatus;

    @Column(name = "performed_by")
    private String performedBy;

    @Column(name = "performed_at", nullable = false)
    @Builder.Default
    private LocalDateTime performedAt = LocalDateTime.now();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private Map<String, Object> details;
}
