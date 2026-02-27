package com.esprit.microservice.courses.entity.progress;

import com.esprit.microservice.courses.entity.content.Course;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "enrollments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id"})
)
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="user_id", nullable=false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="course_id", nullable=false)
    private Course course;

    @Column(nullable=false)
    private String status = "ENROLLED";

    @Column(nullable=false)
    private LocalDateTime enrolledAt;

    @PrePersist
    public void onCreate() {
        this.enrolledAt = LocalDateTime.now();
    }

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