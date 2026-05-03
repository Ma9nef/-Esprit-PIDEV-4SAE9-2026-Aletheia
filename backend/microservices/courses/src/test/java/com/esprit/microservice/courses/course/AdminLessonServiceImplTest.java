package com.esprit.microservice.courses.service.admin;

import com.esprit.microservice.courses.dto.lesson.admin.LessonAdminDTO;
import com.esprit.microservice.courses.dto.lesson.command.LessonUpsertDTO;
import com.esprit.microservice.courses.entity.content.Lesson;
import com.esprit.microservice.courses.service.core.LessonCoreService;
import com.esprit.microservice.courses.service.mapper.LessonMapper;
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
class AdminLessonServiceImplTest {

    @Mock
    private LessonCoreService lessonCoreService;

    @Mock
    private LessonMapper lessonMapper;

    @InjectMocks
    private AdminLessonServiceImpl adminLessonService;

    private Lesson createLesson(Long id, String title) {
        Lesson l = new Lesson();
        ReflectionTestUtils.setField(l, "id", id);
        l.setTitle(title);
        return l;
    }

    @Test
    void shouldCreateLessonSuccessfully() {
        LessonUpsertDTO dto = new LessonUpsertDTO();
        dto.setCourseId(1L);
        dto.setTitle("Lesson 1");
        dto.setContentText("Lesson content");
        dto.setYoutubeVideoId("yt123");
        dto.setPdfRef("file.pdf");
        dto.setOrderIndex(1);

        Lesson savedLesson = createLesson(10L, "Lesson 1");
        savedLesson.setContentText("Lesson content");

        LessonAdminDTO adminDTO = new LessonAdminDTO();
        adminDTO.setId(10L);

        when(lessonCoreService.create(any(Lesson.class), eq(1L))).thenReturn(savedLesson);
        when(lessonMapper.toAdminDTO(savedLesson)).thenReturn(adminDTO);

        LessonAdminDTO result = adminLessonService.create(dto);

        assertNotNull(result);
        assertEquals(10L, result.getId());
    }

    @Test
    void shouldUpdateLessonSuccessfully() {
        Long lessonId = 10L;

        LessonUpsertDTO dto = new LessonUpsertDTO();
        dto.setCourseId(1L);
        dto.setTitle("Updated lesson");

        Lesson savedLesson = createLesson(lessonId, "Updated lesson");

        LessonAdminDTO adminDTO = new LessonAdminDTO();
        adminDTO.setId(lessonId);

        when(lessonCoreService.update(eq(lessonId), any(Lesson.class), eq(1L))).thenReturn(savedLesson);
        when(lessonMapper.toAdminDTO(savedLesson)).thenReturn(adminDTO);

        LessonAdminDTO result = adminLessonService.update(lessonId, dto);

        assertNotNull(result);
        assertEquals(lessonId, result.getId());
    }

    @Test
    void shouldDeleteLessonSuccessfully() {
        Long lessonId = 10L;

        doNothing().when(lessonCoreService).delete(lessonId);

        adminLessonService.delete(lessonId);

        verify(lessonCoreService).delete(lessonId);
    }

    @Test
    void shouldReturnLessonWhenFound() {
        Long lessonId = 10L;

        Lesson lesson = createLesson(lessonId, "Lesson 1");

        LessonAdminDTO adminDTO = new LessonAdminDTO();
        adminDTO.setId(lessonId);

        when(lessonCoreService.findById(lessonId)).thenReturn(Optional.of(lesson));
        when(lessonMapper.toAdminDTO(lesson)).thenReturn(adminDTO);

        Optional<LessonAdminDTO> result = adminLessonService.get(lessonId);

        assertTrue(result.isPresent());
        assertEquals(lessonId, result.get().getId());
    }

    @Test
    void shouldReturnEmptyWhenLessonNotFound() {
        Long lessonId = 10L;

        when(lessonCoreService.findById(lessonId)).thenReturn(Optional.empty());

        Optional<LessonAdminDTO> result = adminLessonService.get(lessonId);

        assertTrue(result.isEmpty());
    }

    @Test
    void shouldReturnLessonsByCourse() {
        Long courseId = 1L;

        Lesson lesson1 = createLesson(1L, "Lesson 1");
        Lesson lesson2 = createLesson(2L, "Lesson 2");

        LessonAdminDTO dto1 = new LessonAdminDTO();
        dto1.setId(1L);

        LessonAdminDTO dto2 = new LessonAdminDTO();
        dto2.setId(2L);

        when(lessonCoreService.findByCourseId(courseId)).thenReturn(List.of(lesson1, lesson2));
        when(lessonMapper.toAdminDTO(lesson1)).thenReturn(dto1);
        when(lessonMapper.toAdminDTO(lesson2)).thenReturn(dto2);

        List<LessonAdminDTO> result = adminLessonService.listByCourse(courseId);

        assertEquals(2, result.size());
    }
}