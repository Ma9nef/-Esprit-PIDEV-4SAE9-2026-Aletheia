package com.esprit.microservice.courses.entity.progress;

import com.esprit.microservice.courses.entity.Certificate;
import com.esprit.microservice.courses.entity.content.Course;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "enrollments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "course_id"})
)
// Prevent errors when serializing Hibernate proxies to JSON
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="user_id", nullable=false)
    private Long userId; // Removed @JsonIgnore so you can see who owns the enrollment

    // Changed to EAGER so the Course details are included in the JSON response
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name="course_id", nullable=false)
    private Course course;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentStatus status ; // Default value

    @Column(nullable=false)
    private LocalDateTime enrolledAt;

    @OneToOne(mappedBy = "enrollment", cascade = CascadeType.ALL)
    @JsonIgnore // Prevent infinite loop if Certificate refers back to Enrollment
    private Certificate certificate;

    @PrePersist
    public void onCreate() {
        this.enrolledAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = EnrollmentStatus.ENROLLED;
        }
    }

    public Enrollment() {}

    public Enrollment(Long userId, Course course) {
        this.userId = userId;
        this.course = course;
        this.status = EnrollmentStatus.ENROLLED; // Ensure status is set
    }

    // Standard Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public EnrollmentStatus getStatus() { return status; }
    public void setStatus(EnrollmentStatus status) { this.status = status; }

    public LocalDateTime getEnrolledAt() { return enrolledAt; }
    public void setEnrolledAt(LocalDateTime enrolledAt) { this.enrolledAt = enrolledAt; }

    public Certificate getCertificate() { return certificate; }
    public void setCertificate(Certificate certificate) { this.certificate = certificate; }

    @Override
    public String toString() {
        return "Enrollment{" + "id=" + id + ", userId=" + userId +
                ", status=" + status + ", enrolledAt=" + enrolledAt + '}';
    }
}