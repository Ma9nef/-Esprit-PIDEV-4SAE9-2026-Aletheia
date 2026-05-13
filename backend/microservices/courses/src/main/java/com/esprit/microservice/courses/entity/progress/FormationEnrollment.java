package com.esprit.microservice.courses.entity.progress;


import com.esprit.microservice.courses.entity.formations.Formation;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "formation_enrollments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "formation_id"})
)
public class FormationEnrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "formation_id", nullable = false)
    private Formation formation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FormationEnrollmentStatus status;

    @Column(nullable = false)
    private LocalDateTime enrolledAt;

    @PrePersist
    public void onCreate() {
        this.enrolledAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = FormationEnrollmentStatus.ACTIVE;
        }
    }

    public FormationEnrollment() {
    }

    public FormationEnrollment(Long userId, Formation formation) {
        this.userId = userId;
        this.formation = formation;
        this.status = FormationEnrollmentStatus.ACTIVE;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Formation getFormation() {
        return formation;
    }

    public FormationEnrollmentStatus getStatus() {
        return status;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setFormation(Formation formation) {
        this.formation = formation;
    }

    public void setStatus(FormationEnrollmentStatus status) {
        this.status = status;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }
}