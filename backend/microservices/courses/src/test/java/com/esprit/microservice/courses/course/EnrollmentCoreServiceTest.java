package com.esprit.microservice.courses.course;

import com.esprit.microservice.courses.entity.content.Course;
import com.esprit.microservice.courses.entity.progress.Enrollment;
import com.esprit.microservice.courses.entity.progress.EnrollmentStatus;
import com.esprit.microservice.courses.repository.CourseRepository;
import com.esprit.microservice.courses.repository.EnrollmentRepository;
import com.esprit.microservice.courses.service.core.EnrollmentCoreService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnrollmentCoreServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private EnrollmentCoreService enrollmentCoreService;

    @Test
    void shouldEnrollUserSuccessfully() {
        Long userId = 1L;
        Long courseId = 10L;

        Course course = new Course();
        course.setId(courseId);

        when(courseRepository.findByIdAndArchivedFalse(courseId))
                .thenReturn(Optional.of(course));
        when(enrollmentRepository.existsByUserIdAndCourse_Id(userId, courseId))
                .thenReturn(false);
        when(enrollmentRepository.save(any(Enrollment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Enrollment result = enrollmentCoreService.enroll(userId, courseId);

        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertNotNull(result.getCourse());
        assertEquals(courseId, result.getCourse().getId());
        assertEquals(EnrollmentStatus.ENROLLED, result.getStatus());
        assertNotNull(result.getEnrolledAt());

        verify(courseRepository, times(1)).findByIdAndArchivedFalse(courseId);
        verify(enrollmentRepository, times(1)).existsByUserIdAndCourse_Id(userId, courseId);
        verify(enrollmentRepository, times(1)).save(any(Enrollment.class));
    }

    @Test
    void shouldThrowExceptionWhenCourseNotFoundOrArchived() {
        Long userId = 1L;
        Long courseId = 10L;

        when(courseRepository.findByIdAndArchivedFalse(courseId))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> enrollmentCoreService.enroll(userId, courseId)
        );

        assertEquals("Course not found or archived", exception.getMessage());

        verify(courseRepository, times(1)).findByIdAndArchivedFalse(courseId);
        verify(enrollmentRepository, never()).existsByUserIdAndCourse_Id(anyLong(), anyLong());
        verify(enrollmentRepository, never()).save(any(Enrollment.class));
    }

    @Test
    void shouldThrowExceptionWhenUserAlreadyEnrolled() {
        Long userId = 1L;
        Long courseId = 10L;

        Course course = new Course();
        course.setId(courseId);

        when(courseRepository.findByIdAndArchivedFalse(courseId))
                .thenReturn(Optional.of(course));
        when(enrollmentRepository.existsByUserIdAndCourse_Id(userId, courseId))
                .thenReturn(true);

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> enrollmentCoreService.enroll(userId, courseId)
        );

        assertEquals("Already enrolled", exception.getMessage());

        verify(courseRepository, times(1)).findByIdAndArchivedFalse(courseId);
        verify(enrollmentRepository, times(1)).existsByUserIdAndCourse_Id(userId, courseId);
        verify(enrollmentRepository, never()).save(any(Enrollment.class));
    }

    @Test
    void shouldReturnUserEnrollments() {
        Long userId = 1L;

        Course course = new Course();
        course.setId(10L);

        Enrollment enrollment1 = new Enrollment(userId, course);
        enrollment1.setId(1L);

        Enrollment enrollment2 = new Enrollment(userId, course);
        enrollment2.setId(2L);

        List<Enrollment> enrollments = List.of(enrollment1, enrollment2);

        when(enrollmentRepository.findAllByUserId(userId)).thenReturn(enrollments);

        List<Enrollment> result = enrollmentCoreService.myEnrollments(userId);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(userId, result.get(0).getUserId());
        assertEquals(userId, result.get(1).getUserId());

        verify(enrollmentRepository, times(1)).findAllByUserId(userId);
    }

    @Test
    void shouldReturnAllEnrollments() {
        Course course1 = new Course();
        course1.setId(10L);

        Course course2 = new Course();
        course2.setId(20L);

        Enrollment enrollment1 = new Enrollment(1L, course1);
        enrollment1.setId(1L);

        Enrollment enrollment2 = new Enrollment(2L, course2);
        enrollment2.setId(2L);

        List<Enrollment> enrollments = List.of(enrollment1, enrollment2);

        when(enrollmentRepository.findAll()).thenReturn(enrollments);

        List<Enrollment> result = enrollmentCoreService.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getUserId());
        assertEquals(2L, result.get(1).getUserId());

        verify(enrollmentRepository, times(1)).findAll();
    }
}