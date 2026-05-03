package com.esprit.microservice.courses.service.core;

import com.esprit.microservice.courses.entity.content.Course;
import com.esprit.microservice.courses.entity.content.Lesson;
import com.esprit.microservice.courses.repository.CourseRepository;
import com.esprit.microservice.courses.repository.LessonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class LessonCoreServiceImpl implements LessonCoreService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;

    public LessonCoreServiceImpl(LessonRepository lessonRepository, CourseRepository courseRepository) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public Lesson create(Lesson lesson, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        // ✅ Toute création de lesson => course repasse en attente validation admin
        course.archive();
        courseRepository.save(course);

        lesson.setCourse(course);
        return lessonRepository.save(lesson);
    }

    @Override
    public Lesson update(Long lessonId, Lesson updated, Long courseId) {
        Lesson existing = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found: " + lessonId));

        if (courseId != null) {
            if (existing.getCourse() == null || !existing.getCourse().getId().equals(courseId)) {
                Course newCourse = courseRepository.findById(courseId)
                        .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));
                existing.setCourse(newCourse);
            }
        }

        Course course = existing.getCourse();

        if (course == null) {
            throw new IllegalArgumentException("Lesson has no course assigned");
        }

        course.archive();
        courseRepository.save(course);

        existing.setTitle(updated.getTitle());
        existing.setContentText(updated.getContentText());
        existing.setYoutubeVideoId(updated.getYoutubeVideoId());
        existing.setPdfRef(updated.getPdfRef());

        if (updated.getOrderIndex() != null) {
            existing.setOrderIndex(updated.getOrderIndex());
        }

        return lessonRepository.save(existing);
    }
    @Override
    @Transactional(readOnly = true)
    public Optional<Lesson> findById(Long lessonId) {
        return lessonRepository.findById(lessonId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Lesson> findByCourseId(Long courseId) {
        // Admin/Instructor: list lessons regardless of course archived status
        return lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }
    @Override
    @Transactional(readOnly = true)
    public List<Lesson> findPublicByCourseId(Long courseId) {
        // Learner/Public: course must be unarchived
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));

        if (course.isArchived()) {
            return List.of();
        }

        return lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }
    @Override
    public void delete(Long lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new IllegalArgumentException("Lesson not found: " + lessonId);
        }
        lessonRepository.deleteById(lessonId);
    }

    @Override
    public long countByCourseId(Long courseId) {
        return lessonRepository.countByCourseId(courseId);
    }


}
