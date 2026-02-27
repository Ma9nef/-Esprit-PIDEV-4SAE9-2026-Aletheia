package com.esprit.microservice.courses.service.core;

import com.esprit.microservice.courses.entity.Lesson;

import java.util.List;
import java.util.Optional;

public interface LessonCoreService {
    Lesson create(Lesson lesson, Long courseId);
    Lesson update(Long lessonId, Lesson updated, Long courseId);

    Optional<Lesson> findById(Long lessonId);

    // For admin/instructor (can list lessons regardless of course archived status)
    List<Lesson> findByCourseId(Long courseId);

    // For learner/public (only if course is unarchived)
    List<Lesson> findPublicByCourseId(Long courseId);

    void delete(Long lessonId);
}
