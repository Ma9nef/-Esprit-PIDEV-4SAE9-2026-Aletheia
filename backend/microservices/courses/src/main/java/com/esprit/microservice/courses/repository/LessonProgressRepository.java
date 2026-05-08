package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.progress.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {

    boolean existsByUserIdAndCourseIdAndLessonId(Long userId, Long courseId, Long lessonId);

    long countByUserIdAndCourseId(Long userId, Long courseId);
}