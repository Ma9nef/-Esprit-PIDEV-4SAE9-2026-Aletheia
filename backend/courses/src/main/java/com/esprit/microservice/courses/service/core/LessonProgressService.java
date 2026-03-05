package com.esprit.microservice.courses.service.core;

import com.esprit.microservice.courses.entity.content.Lesson;
import com.esprit.microservice.courses.entity.progress.LessonProgress;
import com.esprit.microservice.courses.repository.LessonRepository;
import com.esprit.microservice.courses.repository.LessonProgressRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LessonProgressService {

    private final LessonProgressRepository progressRepo;
    private final LessonRepository lessonRepo;

    public LessonProgressService(LessonProgressRepository progressRepo, LessonRepository lessonRepo) {
        this.progressRepo = progressRepo;
        this.lessonRepo = lessonRepo;
    }

    @Transactional
    public void markCompleted(Long userId, Long courseId, Long lessonId) {

        Lesson lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson introuvable: " + lessonId));

        if (lesson.getCourse() == null || lesson.getCourse().getId() == null) {
            throw new IllegalStateException("Lesson sans course associée.");
        }

        if (!lesson.getCourse().getId().equals(courseId)) {
            throw new IllegalArgumentException("La leçon n'appartient pas à ce cours.");
        }

        if (progressRepo.existsByUserIdAndCourseIdAndLessonId(userId, courseId, lessonId)) return;

        try {
            progressRepo.save(new LessonProgress(userId, courseId, lessonId));
        } catch (DataIntegrityViolationException ignored) {
            // idempotent + safe en concurrence
        }
    }

    public boolean isCompleted(Long userId, Long courseId, Long lessonId) {
        return progressRepo.existsByUserIdAndCourseIdAndLessonId(userId, courseId, lessonId);
    }

    public long countCompleted(Long userId, Long courseId) {
        return progressRepo.countByUserIdAndCourseId(userId, courseId);
    }
}