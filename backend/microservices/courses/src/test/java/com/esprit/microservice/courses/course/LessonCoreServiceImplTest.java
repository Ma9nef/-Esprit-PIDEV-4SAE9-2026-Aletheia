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
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LessonCoreServiceImplTest {

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private LessonCoreServiceImpl lessonCoreService;

    private Course createCourse(Long id) {
        Course c = new Course();
        ReflectionTestUtils.setField(c, "id", id);
        return c;
    }

    private Lesson createLesson(Long id, String title) {
        Lesson l = new Lesson();
        ReflectionTestUtils.setField(l, "id", id);
        l.setTitle(title);
        return l;
    }

    @Test
    void shouldCreateLessonSuccessfully() {
        Long courseId = 1L;

        Course course = createCourse(courseId);
        course.setArchived(false);

        Lesson lesson = new Lesson();
        lesson.setTitle("Lesson 1");

        when(courseRepository.findById(courseId)).thenReturn(Optional.of(course));
        when(courseRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(lessonRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Lesson result = lessonCoreService.create(lesson, courseId);

        assertEquals("Lesson 1", result.getTitle());
        assertEquals(courseId, result.getCourse().getId());
    }

    @Test
    void shouldThrowExceptionWhenCreateAndCourseNotFound() {
        when(courseRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> lessonCoreService.create(new Lesson(), 1L));
    }

    @Test
    void shouldUpdateLessonWithoutChangingCourse() {
        Long lessonId = 10L;
        Long courseId = 1L;

        Course course = createCourse(courseId);

        Lesson existing = createLesson(lessonId, "Old");
        existing.setCourse(course);

        Lesson updated = new Lesson();
        updated.setTitle("New");

        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(existing));
        when(courseRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(lessonRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Lesson result = lessonCoreService.update(lessonId, updated, courseId);

        assertEquals("New", result.getTitle());
    }

    @Test
    void shouldUpdateLessonAndChangeCourse() {
        Long lessonId = 10L;

        Course newCourse = createCourse(2L);
        newCourse.setArchived(false);

        Lesson existing = createLesson(lessonId, "Old");

        Lesson updated = new Lesson();
        updated.setTitle("Updated");

        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(existing));
        when(courseRepository.findById(2L)).thenReturn(Optional.of(newCourse));
        when(courseRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(lessonRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        Lesson result = lessonCoreService.update(lessonId, updated, 2L);

        assertEquals("Updated", result.getTitle());
        assertEquals(2L, result.getCourse().getId());
    }

    @Test
    void shouldFindLessonById() {
        Lesson lesson = createLesson(10L, "Lesson");

        when(lessonRepository.findById(10L)).thenReturn(Optional.of(lesson));

        assertTrue(lessonCoreService.findById(10L).isPresent());
    }

    @Test
    void shouldFindLessonsByCourseId() {
        List<Lesson> lessons = List.of(
                createLesson(1L, "L1"),
                createLesson(2L, "L2")
        );

        when(lessonRepository.findByCourseIdOrderByOrderIndexAsc(1L)).thenReturn(lessons);

        assertEquals(2, lessonCoreService.findByCourseId(1L).size());
    }

    @Test
    void shouldFindPublicLessonsWhenCourseIsNotArchived() {
        Course course = createCourse(1L);
        course.setArchived(false);

        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(lessonRepository.findByCourseIdOrderByOrderIndexAsc(1L))
                .thenReturn(List.of(createLesson(1L, "L1")));

        assertEquals(1, lessonCoreService.findPublicByCourseId(1L).size());
    }

    @Test
    void shouldReturnEmptyPublicLessonsWhenCourseArchived() {
        Course course = createCourse(1L);
        course.setArchived(true);
        course.setArchivedAt(LocalDateTime.now());

        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));

        assertTrue(lessonCoreService.findPublicByCourseId(1L).isEmpty());
    }

    @Test
    void shouldDeleteLessonSuccessfully() {
        when(lessonRepository.existsById(10L)).thenReturn(true);

        lessonCoreService.delete(10L);

        verify(lessonRepository).deleteById(10L);
    }

    @Test
    void shouldCountLessonsByCourseId() {
        when(lessonRepository.countByCourseId(1L)).thenReturn(5L);

        assertEquals(5, lessonCoreService.countByCourseId(1L));
    }
}