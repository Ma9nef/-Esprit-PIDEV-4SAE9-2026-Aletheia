package com.esprit.microservice.courses.entity.formations;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "formation_attendance",
        uniqueConstraints = @UniqueConstraint(columnNames = {"session_id", "user_id"}))
public class FormationAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private FormationSession formationSession;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttendanceStatus status = AttendanceStatus.NOT_MARKED;

    @Column(name = "marked_at")
    private LocalDateTime markedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FormationSession getFormationSession() {
        return formationSession;
    }

    public void setFormationSession(FormationSession formationSession) {
        this.formationSession = formationSession;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }

    public LocalDateTime getMarkedAt() {
        return markedAt;
    }

    public void setMarkedAt(LocalDateTime markedAt) {
        this.markedAt = markedAt;
    }
}
