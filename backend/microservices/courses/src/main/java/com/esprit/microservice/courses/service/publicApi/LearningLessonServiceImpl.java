package com.esprit.microservice.courses.service.publicApi;

import com.esprit.microservice.courses.dto.lesson.learning.LessonLearningDTO;
import com.esprit.microservice.courses.service.core.LessonCoreService;
import com.esprit.microservice.courses.service.mapper.LessonMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearningLessonServiceImpl implements LearningLessonService {

    private final LessonCoreService lessonCoreService;
    private final LessonMapper lessonMapper;

    public LearningLessonServiceImpl(LessonCoreService lessonCoreService, LessonMapper lessonMapper) {
        this.lessonCoreService = lessonCoreService;
        this.lessonMapper = lessonMapper;
    }

    @Override
    public List<LessonLearningDTO> listCourseLessons(Long courseId, Long userId) {
        // TODO later: check enrollment (userId enrolled in courseId)
        return lessonCoreService.findPublicByCourseId(courseId)
                .stream()
                .map(lessonMapper::toLearningDTO)
                .toList();
    }

    @Override
    public Optional<LessonLearningDTO> getLesson(Long lessonId, Long userId) {
        // Learner can open only if the course is unarchived
        return lessonCoreService.findById(lessonId)
                .filter(lesson -> !lesson.getCourse().isArchived())
                .map(lessonMapper::toLearningDTO);
    }
}
