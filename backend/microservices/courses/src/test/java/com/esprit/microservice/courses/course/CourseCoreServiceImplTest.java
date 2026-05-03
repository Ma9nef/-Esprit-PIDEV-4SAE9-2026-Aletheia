package com.esprit.microservice.courses.course;

import com.esprit.microservice.courses.entity.content.Course;
import com.esprit.microservice.courses.repository.CourseRepository;
import com.esprit.microservice.courses.service.core.CourseCoreServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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

    @Test
    void shouldFindCourseById() {
        Long courseId = 1L;
        Course course = new Course();
        course.setId(courseId);

        when(courseRepo.findById(courseId)).thenReturn(Optional.of(course));

        Optional<Course> result = courseCoreService.findById(courseId);

        assertTrue(result.isPresent());
        assertEquals(courseId, result.get().getId());
        verify(courseRepo, times(1)).findById(courseId);
    }

    @Test
    void shouldReturnEmptyWhenCourseByIdNotFound() {
        Long courseId = 99L;

        when(courseRepo.findById(courseId)).thenReturn(Optional.empty());

        Optional<Course> result = courseCoreService.findById(courseId);

        assertTrue(result.isEmpty());
        verify(courseRepo, times(1)).findById(courseId);
    }

    @Test
    void shouldFindPublicCourseById() {
        Long courseId = 2L;
        Course course = new Course();
        course.setId(courseId);

        when(courseRepo.findByIdAndArchivedFalse(courseId)).thenReturn(Optional.of(course));

        Optional<Course> result = courseCoreService.findPublicById(courseId);

        assertTrue(result.isPresent());
        assertEquals(courseId, result.get().getId());
        verify(courseRepo, times(1)).findByIdAndArchivedFalse(courseId);
    }

    @Test
    void shouldReturnEmptyWhenPublicCourseByIdNotFound() {
        Long courseId = 100L;

        when(courseRepo.findByIdAndArchivedFalse(courseId)).thenReturn(Optional.empty());

        Optional<Course> result = courseCoreService.findPublicById(courseId);

        assertTrue(result.isEmpty());
        verify(courseRepo, times(1)).findByIdAndArchivedFalse(courseId);
    }

    @Test
    void shouldFindAllCourses() {
        Course c1 = new Course();
        c1.setId(1L);

        Course c2 = new Course();
        c2.setId(2L);

        List<Course> courses = List.of(c1, c2);

        when(courseRepo.findAll()).thenReturn(courses);

        List<Course> result = courseCoreService.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(courseRepo, times(1)).findAll();
    }

    @Test
    void shouldFindAllPublicCourses() {
        Course c1 = new Course();
        c1.setId(1L);

        Course c2 = new Course();
        c2.setId(2L);

        List<Course> publicCourses = List.of(c1, c2);

        when(courseRepo.findByArchivedFalse()).thenReturn(publicCourses);

        List<Course> result = courseCoreService.findPublicAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(courseRepo, times(1)).findByArchivedFalse();
    }

    @Test
    void shouldSaveCourse() {
        Course course = new Course();
        course.setTitle("Java Basics");

        Course savedCourse = new Course();
        savedCourse.setId(1L);
        savedCourse.setTitle("Java Basics");

        when(courseRepo.save(course)).thenReturn(savedCourse);

        Course result = courseCoreService.save(course);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Java Basics", result.getTitle());
        verify(courseRepo, times(1)).save(course);
    }

    @Test
    void shouldFindCoursesByInstructorId() {
        Long instructorId = 10L;

        Course c1 = new Course();
        c1.setId(1L);

        Course c2 = new Course();
        c2.setId(2L);

        List<Course> courses = List.of(c1, c2);

        when(courseRepo.findByInstructorId(instructorId)).thenReturn(courses);

        List<Course> result = courseCoreService.findByInstructorId(instructorId);

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(courseRepo, times(1)).findByInstructorId(instructorId);
    }

    @Test
    void shouldFindCourseByIdAndInstructorId() {
        Long courseId = 1L;
        Long instructorId = 10L;

        Course course = new Course();
        course.setId(courseId);

        when(courseRepo.findByIdAndInstructorId(courseId, instructorId))
                .thenReturn(Optional.of(course));

        Optional<Course> result = courseCoreService.findByIdAndInstructorId(courseId, instructorId);

        assertTrue(result.isPresent());
        assertEquals(courseId, result.get().getId());
        verify(courseRepo, times(1)).findByIdAndInstructorId(courseId, instructorId);
    }

    @Test
    void shouldReturnEmptyWhenCourseByIdAndInstructorIdNotFound() {
        Long courseId = 50L;
        Long instructorId = 99L;

        when(courseRepo.findByIdAndInstructorId(courseId, instructorId))
                .thenReturn(Optional.empty());

        Optional<Course> result = courseCoreService.findByIdAndInstructorId(courseId, instructorId);

        assertTrue(result.isEmpty());
        verify(courseRepo, times(1)).findByIdAndInstructorId(courseId, instructorId);
    }
}