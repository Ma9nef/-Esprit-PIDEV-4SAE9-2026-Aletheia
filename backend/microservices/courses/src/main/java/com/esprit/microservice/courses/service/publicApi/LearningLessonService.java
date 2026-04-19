package com.esprit.microservice.courses.service.publicApi;

import com.esprit.microservice.courses.dto.lesson.learning.LessonLearningDTO;

import java.util.List;
import java.util.Optional;

public interface LearningLessonService {
    List<LessonLearningDTO> listCourseLessons(Long courseId, Long userId);
    Optional<LessonLearningDTO> getLesson(Long lessonId, Long userId);
}
