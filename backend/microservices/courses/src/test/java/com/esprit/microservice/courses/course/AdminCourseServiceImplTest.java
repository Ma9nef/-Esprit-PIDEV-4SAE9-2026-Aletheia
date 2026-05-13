package com.esprit.microservice.courses.course;

import com.esprit.microservice.courses.dto.course.admin.CourseAdminDTO;
import com.esprit.microservice.courses.entity.content.Course;
import com.esprit.microservice.courses.service.admin.AdminCourseServiceImpl;
import com.esprit.microservice.courses.service.core.CourseCoreService;
import com.esprit.microservice.courses.service.mapper.CourseMapper;
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
class AdminCourseServiceImplTest {

    @Mock
    private CourseCoreService core;

    @Mock
    private CourseMapper courseMapper;

    @InjectMocks
    private AdminCourseServiceImpl adminCourseService;

    @Test
    void shouldReturnCourseAdminDtoWhenCourseExists() {
        Long courseId = 1L;

        Course course = new Course();
        course.setId(courseId);
        course.setTitle("Java");

        CourseAdminDTO dto = new CourseAdminDTO();
        dto.setId(courseId);

        when(core.findById(courseId)).thenReturn(Optional.of(course));
        when(courseMapper.toAdminDTO(course)).thenReturn(dto);

        Optional<CourseAdminDTO> result = adminCourseService.getCourse(courseId);

        assertTrue(result.isPresent());
        assertEquals(courseId, result.get().getId());

        verify(core).findById(courseId);
        verify(courseMapper).toAdminDTO(course);
    }

    @Test
    void shouldReturnEmptyWhenCourseDoesNotExist() {
        Long courseId = 1L;

        when(core.findById(courseId)).thenReturn(Optional.empty());

        Optional<CourseAdminDTO> result = adminCourseService.getCourse(courseId);

        assertTrue(result.isEmpty());

        verify(core).findById(courseId);
        verify(courseMapper, never()).toAdminDTO(any(Course.class));
    }

    @Test
    void shouldReturnAllCoursesAsAdminDtos() {
        Course course1 = new Course();
        course1.setId(1L);
        course1.setTitle("Java");

        Course course2 = new Course();
        course2.setId(2L);
        course2.setTitle("Spring");

        CourseAdminDTO dto1 = new CourseAdminDTO();
        dto1.setId(1L);

        CourseAdminDTO dto2 = new CourseAdminDTO();
        dto2.setId(2L);

        when(core.findAll()).thenReturn(List.of(course1, course2));
        when(courseMapper.toAdminDTO(course1)).thenReturn(dto1);
        when(courseMapper.toAdminDTO(course2)).thenReturn(dto2);

        List<CourseAdminDTO> result = adminCourseService.getCourses();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(2L, result.get(1).getId());

        verify(core).findAll();
        verify(courseMapper).toAdminDTO(course1);
        verify(courseMapper).toAdminDTO(course2);
    }

    @Test
    void shouldUnarchiveCourseSuccessfully() {
        Long courseId = 1L;

        Course course = new Course();
        course.setId(courseId);
        course.setArchived(true);

        Course savedCourse = new Course();
        savedCourse.setId(courseId);
        savedCourse.setArchived(false);

        CourseAdminDTO dto = new CourseAdminDTO();
        dto.setId(courseId);

        when(core.findById(courseId)).thenReturn(Optional.of(course));
        when(core.save(course)).thenReturn(savedCourse);
        when(courseMapper.toAdminDTO(savedCourse)).thenReturn(dto);

        CourseAdminDTO result = adminCourseService.unarchive(courseId);

        assertNotNull(result);
        assertFalse(course.isArchived());
        assertEquals(courseId, result.getId());

        verify(core).findById(courseId);
        verify(core).save(course);
        verify(courseMapper).toAdminDTO(savedCourse);
    }

    @Test
    void shouldThrowExceptionWhenUnarchiveCourseNotFound() {
        Long courseId = 1L;

        when(core.findById(courseId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> adminCourseService.unarchive(courseId)
        );

        assertEquals("Course not found: 1", exception.getMessage());

        verify(core).findById(courseId);
        verify(core, never()).save(any(Course.class));
        verify(courseMapper, never()).toAdminDTO(any(Course.class));
    }

    @Test
    void shouldArchiveCourseSuccessfully() {
        Long courseId = 1L;

        Course course = new Course();
        course.setId(courseId);
        course.setArchived(false);

        Course savedCourse = new Course();
        savedCourse.setId(courseId);
        savedCourse.setArchived(true);

        CourseAdminDTO dto = new CourseAdminDTO();
        dto.setId(courseId);

        when(core.findById(courseId)).thenReturn(Optional.of(course));
        when(core.save(course)).thenReturn(savedCourse);
        when(courseMapper.toAdminDTO(savedCourse)).thenReturn(dto);

        CourseAdminDTO result = adminCourseService.archive(courseId);

        assertNotNull(result);
        assertTrue(course.isArchived());
        assertEquals(courseId, result.getId());

        verify(core).findById(courseId);
        verify(core).save(course);
        verify(courseMapper).toAdminDTO(savedCourse);
    }

    @Test
    void shouldThrowExceptionWhenArchiveCourseNotFound() {
        Long courseId = 1L;

        when(core.findById(courseId)).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> adminCourseService.archive(courseId)
        );

        assertEquals("Course not found: 1", exception.getMessage());

        verify(core).findById(courseId);
        verify(core, never()).save(any(Course.class));
        verify(courseMapper, never()).toAdminDTO(any(Course.class));
    }
}