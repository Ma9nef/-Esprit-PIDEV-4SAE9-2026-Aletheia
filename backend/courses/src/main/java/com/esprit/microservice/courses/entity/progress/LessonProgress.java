package com.esprit.microservice.courses.entity.progress;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(
        name = "lesson_progress",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_lesson_progress",
                columnNames = {"user_id", "course_id", "lesson_id"}
        ),
        indexes = {
                @Index(name = "idx_lp_user_course", columnList = "user_id, course_id")
        }
)
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="user_id", nullable=false)
    private Long userId;

    @Column(name="course_id", nullable=false)
    private Long courseId;

    @Column(name="lesson_id", nullable=false)
    private Long lessonId;

    @Column(name="completed_at", nullable=false, updatable=false)
    private Instant completedAt;

    protected LessonProgress() {}

    public LessonProgress(Long userId, Long courseId, Long lessonId) {
        this.userId = userId;
        this.courseId = courseId;
        this.lessonId = lessonId;
    }

    @PrePersist
    void prePersist() {
        if (completedAt == null) completedAt = Instant.now();
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public Long getCourseId() { return courseId; }
    public Long getLessonId() { return lessonId; }
    public Instant getCompletedAt() { return completedAt; }
}