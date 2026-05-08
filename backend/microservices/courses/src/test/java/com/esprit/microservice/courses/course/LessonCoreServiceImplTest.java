package com.esprit.microservice.courses.course;

import com.esprit.microservice.courses.entity.content.Course;
import com.esprit.microservice.courses.entity.content.Lesson;
import com.esprit.microservice.courses.repository.CourseRepository;
import com.esprit.microservice.courses.repository.LessonRepository;
import com.esprit.microservice.courses.service.core.LessonCoreServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LessonCoreServiceImplTest {

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private LessonCoreServiceImpl lessonCoreService;

    @Test
    void shouldCreateLessonSuccessfully() {
        Long courseId = 1L;

        Course course = new Course();
        course.setId(courseId);
        course.setArchived(false);

        Lesson lesson = new Lesson();
        lesson.setTitle("Lesson 1");
        lesson.setContentText("Content");
        lesson.setYoutubeVideoId("abc123");
        lesson.setPdfRef("file.pdf");
        lesson.setOrderIndex(1);

        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));
        when(courseRepository.save(any(Course.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(lessonRepository.save(any(Lesson.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Lesson result = lessonCoreService.create(lesson, courseId);

        assertNotNull(result);
        assertEquals("Lesson 1", result.getTitle());
        assertNotNull(result.getCourse());
        assertEquals(courseId, result.getCourse().getId());
        assertTrue(result.getCourse().isArchived());
        assertNotNull(result.getCourse().getArchivedAt());

        verify(courseRepository).findById(courseId);
        verify(courseRepository).save(course);
        verify(lessonRepository).save(lesson);
    }

    @Test
    void shouldThrowExceptionWhenCreateAndCourseNotFound() {
        Long courseId = 1L;

        Lesson lesson = new Lesson();
        lesson.setTitle("Lesson 1");

        when(courseRepository.findById(courseId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> lessonCoreService.create(lesson, courseId)
        );

        assertEquals("Course not found: 1", exception.getMessage());

        verify(courseRepository).findById(courseId);
        verify(courseRepository, never()).save(any(Course.class));
        verify(lessonRepository, never()).save(any(Lesson.class));
    }

    @Test
    void shouldUpdateLessonWithoutChangingCourse() {
        Long lessonId = 10L;
        Long courseId = 1L;

        Course course = new Course();
        course.setId(courseId);
        course.setArchived(false);

        Lesson existing = new Lesson();
        existing.setId(lessonId);
        existing.setTitle("Old title");
        existing.setContentText("Old content");
        existing.setYoutubeVideoId("oldVideo");
        existing.setPdfRef("old.pdf");
        existing.setOrderIndex(1);
        existing.setCourse(course);

        Lesson updated = new Lesson();
        updated.setTitle("New title");
        updated.setContentText("New content");
        updated.setYoutubeVideoId("newVideo");
        updated.setPdfRef("new.pdf");
        updated.setOrderIndex(2);

        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(existing));
        when(courseRepository.save(any(Course.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(lessonRepository.save(any(Lesson.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Lesson result = lessonCoreService.update(lessonId, updated, courseId);

        assertNotNull(result);
        assertEquals("New title", result.getTitle());
        assertEquals("New content", result.getContentText());
        assertEquals("newVideo", result.getYoutubeVideoId());
        assertEquals("new.pdf", result.getPdfRef());
        assertEquals(2, result.getOrderIndex());
        assertEquals(courseId, result.getCourse().getId());
        assertTrue(result.getCourse().isArchived());
        assertNotNull(result.getCourse().getArchivedAt());

        verify(lessonRepository).findById(lessonId);
        verify(courseRepository, never()).findById(courseId);
        verify(courseRepository).save(course);
        verify(lessonRepository).save(existing);
    }

    @Test
    void shouldUpdateLessonAndChangeCourse() {
        Long lessonId = 10L;
        Long oldCourseId = 1L;
        Long newCourseId = 2L;

        Course oldCourse = new Course();
        oldCourse.setId(oldCourseId);

        Course newCourse = new Course();
        newCourse.setId(newCourseId);
        newCourse.setArchived(false);

        Lesson existing = new Lesson();
        existing.setId(lessonId);
        existing.setTitle("Old title");
        existing.setCourse(oldCourse);

        Lesson updated = new Lesson();
        updated.setTitle("Updated title");
        updated.setContentText("Updated content");
        updated.setYoutubeVideoId("yt123");
        updated.setPdfRef("updated.pdf");
        updated.setOrderIndex(3);

        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(existing));
        when(courseRepository.findById(newCourseId)).thenReturn(Optional.of(newCourse));
        when(courseRepository.save(any(Course.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(lessonRepository.save(any(Lesson.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Lesson result = lessonCoreService.update(lessonId, updated, newCourseId);

        assertNotNull(result);
        assertEquals("Updated title", result.getTitle());
        assertEquals("Updated content", result.getContentText());
        assertEquals("yt123", result.getYoutubeVideoId());
        assertEquals("updated.pdf", result.getPdfRef());
        assertEquals(3, result.getOrderIndex());
        assertNotNull(result.getCourse());
        assertEquals(newCourseId, result.getCourse().getId());
        assertTrue(result.getCourse().isArchived());
        assertNotNull(result.getCourse().getArchivedAt());

        verify(lessonRepository).findById(lessonId);
        verify(courseRepository).findById(newCourseId);
        verify(courseRepository).save(newCourse);
        verify(lessonRepository).save(existing);
    }

    @Test
    void shouldThrowExceptionWhenUpdateAndLessonNotFound() {
        Long lessonId = 10L;
        Long courseId = 1L;

        Lesson updated = new Lesson();
        updated.setTitle("Updated title");

        when(lessonRepository.findById(lessonId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> lessonCoreService.update(lessonId, updated, courseId)
        );

        assertEquals("Lesson not found: 10", exception.getMessage());

        verify(lessonRepository).findById(lessonId);
        verify(courseRepository, never()).findById(anyLong());
        verify(courseRepository, never()).save(any(Course.class));
        verify(lessonRepository, never()).save(any(Lesson.class));
    }

    @Test
    void shouldThrowExceptionWhenUpdateAndNewCourseNotFound() {
        Long lessonId = 10L;
        Long oldCourseId = 1L;
        Long newCourseId = 2L;

        Course oldCourse = new Course();
        oldCourse.setId(oldCourseId);

        Lesson existing = new Lesson();
        existing.setId(lessonId);
        existing.setCourse(oldCourse);

        Lesson updated = new Lesson();
        updated.setTitle("Updated title");

        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(existing));
        when(courseRepository.findById(newCourseId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> lessonCoreService.update(lessonId, updated, newCourseId)
        );

        assertEquals("Course not found: 2", exception.getMessage());

        verify(lessonRepository).findById(lessonId);
        verify(courseRepository).findById(newCourseId);
        verify(courseRepository, never()).save(any(Course.class));
        verify(lessonRepository, never()).save(any(Lesson.class));
    }

    @Test
    void shouldFindLessonById() {
        Long lessonId = 10L;

        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        lesson.setTitle("Lesson 1");

        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(lesson));

        Optional<Lesson> result = lessonCoreService.findById(lessonId);

        assertTrue(result.isPresent());
        assertEquals(lessonId, result.get().getId());
        assertEquals("Lesson 1", result.get().getTitle());

        verify(lessonRepository).findById(lessonId);
    }

    @Test
    void shouldReturnEmptyWhenFindLessonByIdNotFound() {
        Long lessonId = 10L;

        when(lessonRepository.findById(lessonId)).thenReturn(Optional.empty());

        Optional<Lesson> result = lessonCoreService.findById(lessonId);

        assertTrue(result.isEmpty());

        verify(lessonRepository).findById(lessonId);
    }

    @Test
    void shouldFindLessonsByCourseId() {
        Long courseId = 1L;

        Lesson lesson1 = new Lesson();
        lesson1.setId(1L);
        lesson1.setTitle("Lesson 1");
        lesson1.setOrderIndex(1);

        Lesson lesson2 = new Lesson();
        lesson2.setId(2L);
        lesson2.setTitle("Lesson 2");
        lesson2.setOrderIndex(2);

        List<Lesson> lessons = List.of(lesson1, lesson2);

        when(lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId)).thenReturn(lessons);

        List<Lesson> result = lessonCoreService.findByCourseId(courseId);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Lesson 1", result.get(0).getTitle());
        assertEquals("Lesson 2", result.get(1).getTitle());

        verify(lessonRepository).findByCourseIdOrderByOrderIndexAsc(courseId);
    }

    @Test
    void shouldFindPublicLessonsWhenCourseIsNotArchived() {
        Long courseId = 1L;

        Course course = new Course();
        course.setId(courseId);
        course.setArchived(false);

        Lesson lesson1 = new Lesson();
        lesson1.setId(1L);
        lesson1.setTitle("Lesson 1");

        Lesson lesson2 = new Lesson();
        lesson2.setId(2L);
        lesson2.setTitle("Lesson 2");

        List<Lesson> lessons = List.of(lesson1, lesson2);

        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));
        when(lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId)).thenReturn(lessons);

        List<Lesson> result = lessonCoreService.findPublicByCourseId(courseId);

        assertNotNull(result);
        assertEquals(2, result.size());

        verify(courseRepository).findById(courseId);
        verify(lessonRepository).findByCourseIdOrderByOrderIndexAsc(courseId);
    }

    @Test
    void shouldReturnEmptyPublicLessonsWhenCourseArchived() {
        Long courseId = 1L;

        Course course = new Course();
        course.setId(courseId);
        course.setArchived(true);
        course.setArchivedAt(LocalDateTime.now());

        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));

        List<Lesson> result = lessonCoreService.findPublicByCourseId(courseId);

        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(courseRepository).findById(courseId);
        verify(lessonRepository, never()).findByCourseIdOrderByOrderIndexAsc(anyLong());
    }

    @Test
    void shouldThrowExceptionWhenFindPublicLessonsAndCourseNotFound() {
        Long courseId = 1L;

        when(courseRepository.findById(courseId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> lessonCoreService.findPublicByCourseId(courseId)
        );

        assertEquals("Course not found: 1", exception.getMessage());

        verify(courseRepository).findById(courseId);
        verify(lessonRepository, never()).findByCourseIdOrderByOrderIndexAsc(anyLong());
    }

    @Test
    void shouldDeleteLessonSuccessfully() {
        Long lessonId = 10L;

        when(lessonRepository.existsById(lessonId)).thenReturn(true);
        doNothing().when(lessonRepository).deleteById(lessonId);

        lessonCoreService.delete(lessonId);

        verify(lessonRepository).existsById(lessonId);
        verify(lessonRepository).deleteById(lessonId);
    }

    @Test
    void shouldThrowExceptionWhenDeleteLessonNotFound() {
        Long lessonId = 10L;

        when(lessonRepository.existsById(lessonId)).thenReturn(false);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> lessonCoreService.delete(lessonId)
        );

        assertEquals("Lesson not found: 10", exception.getMessage());

        verify(lessonRepository).existsById(lessonId);
        verify(lessonRepository, never()).deleteById(anyLong());
    }

    @Test
    void shouldCountLessonsByCourseId() {
        Long courseId = 1L;

        when(lessonRepository.countByCourseId(courseId)).thenReturn(5L);

        long result = lessonCoreService.countByCourseId(courseId);

        assertEquals(5L, result);

        verify(lessonRepository).countByCourseId(courseId);
    }
}