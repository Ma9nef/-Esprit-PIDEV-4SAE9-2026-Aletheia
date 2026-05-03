package com.esprit.microservice.resourcemanagement.entity;

import com.esprit.microservice.resourcemanagement.entity.enums.SessionType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "teaching_sessions", indexes = {
        @Index(name = "idx_session_instructor", columnList = "instructor_id"),
        @Index(name = "idx_session_course_code", columnList = "course_code")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TeachingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(name = "course_code", length = 50)
    private String courseCode;

    @Column(name = "instructor_id", nullable = false, length = 100)
    private String instructorId;

    @Column(length = 100)
    private String module;

    @Column(name = "expected_attendees")
    private Integer expectedAttendees;

    @Enumerated(EnumType.STRING)
    @Column(name = "session_type", nullable = false, length = 30)
    @Builder.Default
    private SessionType sessionType = SessionType.LECTURE;

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
}
