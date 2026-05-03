package com.esprit.microservice.courses.course;

import com.esprit.microservice.courses.entity.content.Course;
import com.esprit.microservice.courses.repository.CourseRepository;
import com.esprit.microservice.courses.service.core.CourseCoreServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseCoreServiceImplTest {

    @Mock
    private CourseRepository courseRepo;

    @InjectMocks
    private CourseCoreServiceImpl courseCoreService;

    private Course createCourse(Long id) {
        Course c = new Course();
        ReflectionTestUtils.setField(c, "id", id);
        return c;
    }

    @Test
    void shouldFindCourseById() {
        Long courseId = 1L;
        Course course = createCourse(courseId);

        when(courseRepo.findById(courseId)).thenReturn(Optional.of(course));

        Optional<Course> result = courseCoreService.findById(courseId);

        assertTrue(result.isPresent());
        assertEquals(courseId, result.get().getId());
    }

    @Test
    void shouldReturnEmptyWhenCourseByIdNotFound() {
        Long courseId = 99L;

        when(courseRepo.findById(courseId)).thenReturn(Optional.empty());

        Optional<Course> result = courseCoreService.findById(courseId);

        assertTrue(result.isEmpty());
    }

    @Test
    void shouldFindPublicCourseById() {
        Long courseId = 2L;
        Course course = createCourse(courseId);

        when(courseRepo.findByIdAndArchivedFalse(courseId)).thenReturn(Optional.of(course));

        Optional<Course> result = courseCoreService.findPublicById(courseId);

        assertTrue(result.isPresent());
        assertEquals(courseId, result.get().getId());
    }

    @Test
    void shouldReturnEmptyWhenPublicCourseByIdNotFound() {
        Long courseId = 100L;

        when(courseRepo.findByIdAndArchivedFalse(courseId)).thenReturn(Optional.empty());

        Optional<Course> result = courseCoreService.findPublicById(courseId);

        assertTrue(result.isEmpty());
    }

    @Test
    void shouldFindAllCourses() {
        Course c1 = createCourse(1L);
        Course c2 = createCourse(2L);

        when(courseRepo.findAll()).thenReturn(List.of(c1, c2));

        List<Course> result = courseCoreService.findAll();

        assertEquals(2, result.size());
    }

    @Test
    void shouldFindAllPublicCourses() {
        Course c1 = createCourse(1L);
        Course c2 = createCourse(2L);

        when(courseRepo.findByArchivedFalse()).thenReturn(List.of(c1, c2));

        List<Course> result = courseCoreService.findPublicAll();

        assertEquals(2, result.size());
    }

    @Test
    void shouldSaveCourse() {
        Course course = new Course();
        course.setTitle("Java Basics");

        Course savedCourse = createCourse(1L);
        savedCourse.setTitle("Java Basics");

        when(courseRepo.save(course)).thenReturn(savedCourse);

        Course result = courseCoreService.save(course);

        assertEquals(1L, result.getId());
        assertEquals("Java Basics", result.getTitle());
    }

    @Test
    void shouldFindCoursesByInstructorId() {
        Long instructorId = 10L;

        Course c1 = createCourse(1L);
        Course c2 = createCourse(2L);

        when(courseRepo.findByInstructorId(instructorId)).thenReturn(List.of(c1, c2));

        List<Course> result = courseCoreService.findByInstructorId(instructorId);

        assertEquals(2, result.size());
    }

    @Test
    void shouldFindCourseByIdAndInstructorId() {
        Long courseId = 1L;
        Long instructorId = 10L;

        Course course = createCourse(courseId);

        when(courseRepo.findByIdAndInstructorId(courseId, instructorId))
                .thenReturn(Optional.of(course));

        Optional<Course> result = courseCoreService.findByIdAndInstructorId(courseId, instructorId);

        assertTrue(result.isPresent());
    }

    @Test
    void shouldReturnEmptyWhenCourseByIdAndInstructorIdNotFound() {
        Long courseId = 50L;
        Long instructorId = 99L;

        when(courseRepo.findByIdAndInstructorId(courseId, instructorId))
                .thenReturn(Optional.empty());

        Optional<Course> result = courseCoreService.findByIdAndInstructorId(courseId, instructorId);

        assertTrue(result.isEmpty());
    }
}