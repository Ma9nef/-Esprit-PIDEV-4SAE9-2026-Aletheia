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
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnrollmentCoreServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private EnrollmentCoreService enrollmentCoreService;

    private Course createCourse(Long id) {
        Course c = new Course();
        ReflectionTestUtils.setField(c, "id", id);
        return c;
    }

    private Enrollment createEnrollment(Long id, Long userId, Course course) {
        Enrollment e = new Enrollment(userId, course);
        ReflectionTestUtils.setField(e, "id", id);
        return e;
    }

    @Test
    void shouldEnrollUserSuccessfully() {
        Long userId = 1L;
        Long courseId = 10L;

        Course course = createCourse(courseId);

        when(courseRepository.findByIdAndArchivedFalse(courseId))
                .thenReturn(Optional.of(course));
        when(enrollmentRepository.existsByUserIdAndCourse_Id(userId, courseId))
                .thenReturn(false);
        when(enrollmentRepository.save(any(Enrollment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Enrollment result = enrollmentCoreService.enroll(userId, courseId);

        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(courseId, result.getCourse().getId());
        assertEquals(EnrollmentStatus.ENROLLED, result.getStatus());
    }

    @Test
    void shouldThrowExceptionWhenCourseNotFoundOrArchived() {
        when(courseRepository.findByIdAndArchivedFalse(anyLong()))
                .thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> enrollmentCoreService.enroll(1L, 10L));
    }

    @Test
    void shouldThrowExceptionWhenUserAlreadyEnrolled() {
        Long userId = 1L;
        Long courseId = 10L;

        Course course = createCourse(courseId);

        when(courseRepository.findByIdAndArchivedFalse(courseId))
                .thenReturn(Optional.of(course));
        when(enrollmentRepository.existsByUserIdAndCourse_Id(userId, courseId))
                .thenReturn(true);

        assertThrows(IllegalStateException.class,
                () -> enrollmentCoreService.enroll(userId, courseId));
    }

    @Test
    void shouldReturnUserEnrollments() {
        Long userId = 1L;

        Course course = createCourse(10L);

        Enrollment e1 = createEnrollment(1L, userId, course);
        Enrollment e2 = createEnrollment(2L, userId, course);

        when(enrollmentRepository.findAllByUserId(userId))
                .thenReturn(List.of(e1, e2));

        List<Enrollment> result = enrollmentCoreService.myEnrollments(userId);

        assertEquals(2, result.size());
        assertEquals(userId, result.get(0).getUserId());
    }

    @Test
    void shouldReturnAllEnrollments() {
        Course c1 = createCourse(10L);
        Course c2 = createCourse(20L);

        Enrollment e1 = createEnrollment(1L, 1L, c1);
        Enrollment e2 = createEnrollment(2L, 2L, c2);

        when(enrollmentRepository.findAll()).thenReturn(List.of(e1, e2));

        List<Enrollment> result = enrollmentCoreService.findAll();

        assertEquals(2, result.size());
    }
}