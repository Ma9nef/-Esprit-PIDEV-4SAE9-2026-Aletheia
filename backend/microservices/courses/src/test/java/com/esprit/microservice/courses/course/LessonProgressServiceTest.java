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
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LessonProgressServiceTest {

    @Mock
    private LessonProgressRepository progressRepo;

    @Mock
    private LessonRepository lessonRepo;

    @InjectMocks
    private LessonProgressService lessonProgressService;

    private Course createCourse(Long id) {
        Course c = new Course();
        ReflectionTestUtils.setField(c, "id", id);
        return c;
    }

    private Lesson createLesson(Long id, Course course) {
        Lesson l = new Lesson();
        ReflectionTestUtils.setField(l, "id", id);
        l.setCourse(course);
        return l;
    }

    @Test
    void shouldMarkLessonCompletedSuccessfully() {
        Long userId = 1L;
        Long courseId = 10L;
        Long lessonId = 100L;

        Course course = createCourse(courseId);
        Lesson lesson = createLesson(lessonId, course);

        when(lessonRepo.findById(lessonId)).thenReturn(Optional.of(lesson));
        when(progressRepo.existsByUserIdAndCourseIdAndLessonId(userId, courseId, lessonId)).thenReturn(false);

        lessonProgressService.markCompleted(userId, courseId, lessonId);

        verify(progressRepo).save(any(LessonProgress.class));
    }

    @Test
    void shouldThrowExceptionWhenLessonNotFound() {
        when(lessonRepo.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> lessonProgressService.markCompleted(1L, 10L, 100L));
    }

    @Test
    void shouldThrowExceptionWhenLessonHasNoCourse() {
        Lesson lesson = new Lesson();
        ReflectionTestUtils.setField(lesson, "id", 100L);

        when(lessonRepo.findById(100L)).thenReturn(Optional.of(lesson));

        assertThrows(IllegalStateException.class,
                () -> lessonProgressService.markCompleted(1L, 10L, 100L));
    }

    @Test
    void shouldThrowExceptionWhenLessonDoesNotBelongToCourse() {
        Course course = createCourse(99L);
        Lesson lesson = createLesson(100L, course);

        when(lessonRepo.findById(100L)).thenReturn(Optional.of(lesson));

        assertThrows(IllegalArgumentException.class,
                () -> lessonProgressService.markCompleted(1L, 10L, 100L));
    }

    @Test
    void shouldNotSaveWhenAlreadyCompleted() {
        Course course = createCourse(10L);
        Lesson lesson = createLesson(100L, course);

        when(lessonRepo.findById(100L)).thenReturn(Optional.of(lesson));
        when(progressRepo.existsByUserIdAndCourseIdAndLessonId(1L, 10L, 100L)).thenReturn(true);

        lessonProgressService.markCompleted(1L, 10L, 100L);

        verify(progressRepo, never()).save(any());
    }

    @Test
    void shouldIgnoreDataIntegrityViolationWhenSaving() {
        Course course = createCourse(10L);
        Lesson lesson = createLesson(100L, course);

        when(lessonRepo.findById(100L)).thenReturn(Optional.of(lesson));
        when(progressRepo.existsByUserIdAndCourseIdAndLessonId(1L, 10L, 100L)).thenReturn(false);
        doThrow(new DataIntegrityViolationException("duplicate"))
                .when(progressRepo).save(any());

        assertDoesNotThrow(() ->
                lessonProgressService.markCompleted(1L, 10L, 100L));
    }

    @Test
    void shouldReturnTrueWhenLessonIsCompleted() {
        when(progressRepo.existsByUserIdAndCourseIdAndLessonId(1L, 10L, 100L)).thenReturn(true);

        assertTrue(lessonProgressService.isCompleted(1L, 10L, 100L));
    }

    @Test
    void shouldReturnFalseWhenLessonIsNotCompleted() {
        when(progressRepo.existsByUserIdAndCourseIdAndLessonId(1L, 10L, 100L)).thenReturn(false);

        assertFalse(lessonProgressService.isCompleted(1L, 10L, 100L));
    }

    @Test
    void shouldCountCompletedLessons() {
        when(progressRepo.countByUserIdAndCourseId(1L, 10L)).thenReturn(3L);

        assertEquals(3L, lessonProgressService.countCompleted(1L, 10L));
    }
}