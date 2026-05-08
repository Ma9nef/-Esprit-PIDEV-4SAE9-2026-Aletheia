package com.esprit.microservice.courses.course;

import com.esprit.microservice.courses.entity.content.Course;
import com.esprit.microservice.courses.entity.content.Lesson;
import com.esprit.microservice.courses.entity.progress.LessonProgress;
import com.esprit.microservice.courses.repository.LessonProgressRepository;
import com.esprit.microservice.courses.repository.LessonRepository;
import com.esprit.microservice.courses.service.core.LessonProgressService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LessonProgressServiceTest {

    @Mock
    private LessonProgressRepository progressRepo;

    @Mock
    private LessonRepository lessonRepo;

    @InjectMocks
    private LessonProgressService lessonProgressService;

    @Test
    void shouldMarkLessonCompletedSuccessfully() {
        Long userId = 1L;
        Long courseId = 10L;
        Long lessonId = 100L;

        Course course = new Course();
        course.setId(courseId);

        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        lesson.setCourse(course);

        when(lessonRepo.findById(lessonId)).thenReturn(Optional.of(lesson));
        when(progressRepo.existsByUserIdAndCourseIdAndLessonId(userId, courseId, lessonId)).thenReturn(false);

        lessonProgressService.markCompleted(userId, courseId, lessonId);

        verify(lessonRepo).findById(lessonId);
        verify(progressRepo).existsByUserIdAndCourseIdAndLessonId(userId, courseId, lessonId);
        verify(progressRepo).save(any(LessonProgress.class));
    }

    @Test
    void shouldThrowExceptionWhenLessonNotFound() {
        Long userId = 1L;
        Long courseId = 10L;
        Long lessonId = 100L;

        when(lessonRepo.findById(lessonId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> lessonProgressService.markCompleted(userId, courseId, lessonId)
        );

        assertEquals("Lesson introuvable: 100", exception.getMessage());

        verify(lessonRepo).findById(lessonId);
        verify(progressRepo, never()).existsByUserIdAndCourseIdAndLessonId(anyLong(), anyLong(), anyLong());
        verify(progressRepo, never()).save(any(LessonProgress.class));
    }

    @Test
    void shouldThrowExceptionWhenLessonHasNoCourse() {
        Long userId = 1L;
        Long courseId = 10L;
        Long lessonId = 100L;

        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        lesson.setCourse(null);

        when(lessonRepo.findById(lessonId)).thenReturn(Optional.of(lesson));

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> lessonProgressService.markCompleted(userId, courseId, lessonId)
        );

        assertEquals("Lesson sans course associée.", exception.getMessage());

        verify(lessonRepo).findById(lessonId);
        verify(progressRepo, never()).existsByUserIdAndCourseIdAndLessonId(anyLong(), anyLong(), anyLong());
        verify(progressRepo, never()).save(any(LessonProgress.class));
    }

    @Test
    void shouldThrowExceptionWhenLessonCourseIdIsNull() {
        Long userId = 1L;
        Long courseId = 10L;
        Long lessonId = 100L;

        Course course = new Course();
        course.setId(null);

        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        lesson.setCourse(course);

        when(lessonRepo.findById(lessonId)).thenReturn(Optional.of(lesson));

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> lessonProgressService.markCompleted(userId, courseId, lessonId)
        );

        assertEquals("Lesson sans course associée.", exception.getMessage());

        verify(lessonRepo).findById(lessonId);
        verify(progressRepo, never()).existsByUserIdAndCourseIdAndLessonId(anyLong(), anyLong(), anyLong());
        verify(progressRepo, never()).save(any(LessonProgress.class));
    }

    @Test
    void shouldThrowExceptionWhenLessonDoesNotBelongToCourse() {
        Long userId = 1L;
        Long courseId = 10L;
        Long lessonId = 100L;

        Course course = new Course();
        course.setId(99L);

        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        lesson.setCourse(course);

        when(lessonRepo.findById(lessonId)).thenReturn(Optional.of(lesson));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> lessonProgressService.markCompleted(userId, courseId, lessonId)
        );

        assertEquals("La leçon n'appartient pas à ce cours.", exception.getMessage());

        verify(lessonRepo).findById(lessonId);
        verify(progressRepo, never()).existsByUserIdAndCourseIdAndLessonId(anyLong(), anyLong(), anyLong());
        verify(progressRepo, never()).save(any(LessonProgress.class));
    }

    @Test
    void shouldNotSaveWhenAlreadyCompleted() {
        Long userId = 1L;
        Long courseId = 10L;
        Long lessonId = 100L;

        Course course = new Course();
        course.setId(courseId);

        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        lesson.setCourse(course);

        when(lessonRepo.findById(lessonId)).thenReturn(Optional.of(lesson));
        when(progressRepo.existsByUserIdAndCourseIdAndLessonId(userId, courseId, lessonId)).thenReturn(true);

        lessonProgressService.markCompleted(userId, courseId, lessonId);

        verify(lessonRepo).findById(lessonId);
        verify(progressRepo).existsByUserIdAndCourseIdAndLessonId(userId, courseId, lessonId);
        verify(progressRepo, never()).save(any(LessonProgress.class));
    }

    @Test
    void shouldIgnoreDataIntegrityViolationWhenSaving() {
        Long userId = 1L;
        Long courseId = 10L;
        Long lessonId = 100L;

        Course course = new Course();
        course.setId(courseId);

        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        lesson.setCourse(course);

        when(lessonRepo.findById(lessonId)).thenReturn(Optional.of(lesson));
        when(progressRepo.existsByUserIdAndCourseIdAndLessonId(userId, courseId, lessonId)).thenReturn(false);
        doThrow(new DataIntegrityViolationException("duplicate"))
                .when(progressRepo).save(any(LessonProgress.class));

        assertDoesNotThrow(() -> lessonProgressService.markCompleted(userId, courseId, lessonId));

        verify(lessonRepo).findById(lessonId);
        verify(progressRepo).existsByUserIdAndCourseIdAndLessonId(userId, courseId, lessonId);
        verify(progressRepo).save(any(LessonProgress.class));
    }

    @Test
    void shouldReturnTrueWhenLessonIsCompleted() {
        Long userId = 1L;
        Long courseId = 10L;
        Long lessonId = 100L;

        when(progressRepo.existsByUserIdAndCourseIdAndLessonId(userId, courseId, lessonId)).thenReturn(true);

        boolean result = lessonProgressService.isCompleted(userId, courseId, lessonId);

        assertTrue(result);
        verify(progressRepo).existsByUserIdAndCourseIdAndLessonId(userId, courseId, lessonId);
    }

    @Test
    void shouldReturnFalseWhenLessonIsNotCompleted() {
        Long userId = 1L;
        Long courseId = 10L;
        Long lessonId = 100L;

        when(progressRepo.existsByUserIdAndCourseIdAndLessonId(userId, courseId, lessonId)).thenReturn(false);

        boolean result = lessonProgressService.isCompleted(userId, courseId, lessonId);

        assertFalse(result);
        verify(progressRepo).existsByUserIdAndCourseIdAndLessonId(userId, courseId, lessonId);
    }

    @Test
    void shouldCountCompletedLessons() {
        Long userId = 1L;
        Long courseId = 10L;

        when(progressRepo.countByUserIdAndCourseId(userId, courseId)).thenReturn(3L);

        long result = lessonProgressService.countCompleted(userId, courseId);

        assertEquals(3L, result);
        verify(progressRepo).countByUserIdAndCourseId(userId, courseId);
    }
}