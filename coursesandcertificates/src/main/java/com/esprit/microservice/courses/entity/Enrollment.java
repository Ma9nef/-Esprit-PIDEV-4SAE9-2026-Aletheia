package com.esprit.microservice.courses.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter

@Entity
@Table(
        name = "enrollments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id"})
)
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="user_id", nullable=true)
    private Long userId;
    private Double progress;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="course_id", nullable=false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "modules", "lessons"})
    private Course course;

    @Column(nullable=false)
    private String status = "ENROLLED";

    @Column(nullable=false)
    private LocalDateTime enrolledAt;

    @PrePersist
    public void onCreate() {
        this.enrolledAt = LocalDateTime.now();
    }
    @JsonIgnore
    // A Certificate is generated only for an Enrollment
    @OneToOne(mappedBy = "enrollment", cascade = CascadeType.ALL)

    private Certificate certificate;

    public Enrollment() {}

    public Enrollment(Long userId, Course course) {
        this.userId = userId;
        this.course = course;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Course getCourse() { return course; }
    public String getStatus() { return status; }
    public LocalDateTime getEnrolledAt() { return enrolledAt; }

    public void setStatus(String status) { this.status = status; }
}