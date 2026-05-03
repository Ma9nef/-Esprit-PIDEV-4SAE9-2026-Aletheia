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

    @Test
    void shouldCreateLessonSuccessfully() {
        LessonUpsertDTO dto = new LessonUpsertDTO();
        dto.setCourseId(1L);
        dto.setTitle("Lesson 1");
        dto.setContentText("Lesson content");
        dto.setYoutubeVideoId("yt123");
        dto.setPdfRef("file.pdf");
        dto.setOrderIndex(1);

        Lesson savedLesson = new Lesson();
        savedLesson.setId(10L);
        savedLesson.setTitle("Lesson 1");
        savedLesson.setContentText("Lesson content");
        savedLesson.setYoutubeVideoId("yt123");
        savedLesson.setPdfRef("file.pdf");
        savedLesson.setOrderIndex(1);

        LessonAdminDTO adminDTO = new LessonAdminDTO();
        adminDTO.setId(10L);

        when(lessonCoreService.create(any(Lesson.class), eq(1L))).thenReturn(savedLesson);
        when(lessonMapper.toAdminDTO(savedLesson)).thenReturn(adminDTO);

        LessonAdminDTO result = adminLessonService.create(dto);

        assertNotNull(result);
        assertEquals(10L, result.getId());

        verify(lessonCoreService).create(any(Lesson.class), eq(1L));
        verify(lessonMapper).toAdminDTO(savedLesson);
    }

    @Test
    void shouldUpdateLessonSuccessfully() {
        Long lessonId = 10L;

        LessonUpsertDTO dto = new LessonUpsertDTO();
        dto.setCourseId(1L);
        dto.setTitle("Updated lesson");
        dto.setContentText("Updated content");
        dto.setYoutubeVideoId("yt999");
        dto.setPdfRef("updated.pdf");
        dto.setOrderIndex(2);

        Lesson savedLesson = new Lesson();
        savedLesson.setId(lessonId);
        savedLesson.setTitle("Updated lesson");
        savedLesson.setContentText("Updated content");
        savedLesson.setYoutubeVideoId("yt999");
        savedLesson.setPdfRef("updated.pdf");
        savedLesson.setOrderIndex(2);

        LessonAdminDTO adminDTO = new LessonAdminDTO();
        adminDTO.setId(lessonId);

        when(lessonCoreService.update(eq(lessonId), any(Lesson.class), eq(1L))).thenReturn(savedLesson);
        when(lessonMapper.toAdminDTO(savedLesson)).thenReturn(adminDTO);

        LessonAdminDTO result = adminLessonService.update(lessonId, dto);

        assertNotNull(result);
        assertEquals(lessonId, result.getId());

        verify(lessonCoreService).update(eq(lessonId), any(Lesson.class), eq(1L));
        verify(lessonMapper).toAdminDTO(savedLesson);
    }

    @Test
    void shouldDeleteLessonSuccessfully() {
        Long lessonId = 10L;

        doNothing().when(lessonCoreService).delete(lessonId);

        adminLessonService.delete(lessonId);

        verify(lessonCoreService).delete(lessonId);
        verifyNoInteractions(lessonMapper);
    }

    @Test
    void shouldReturnLessonWhenFound() {
        Long lessonId = 10L;

        Lesson lesson = new Lesson();
        lesson.setId(lessonId);
        lesson.setTitle("Lesson 1");

        LessonAdminDTO adminDTO = new LessonAdminDTO();
        adminDTO.setId(lessonId);

        when(lessonCoreService.findById(lessonId)).thenReturn(Optional.of(lesson));
        when(lessonMapper.toAdminDTO(lesson)).thenReturn(adminDTO);

        Optional<LessonAdminDTO> result = adminLessonService.get(lessonId);

        assertTrue(result.isPresent());
        assertEquals(lessonId, result.get().getId());

        verify(lessonCoreService).findById(lessonId);
        verify(lessonMapper).toAdminDTO(lesson);
    }

    @Test
    void shouldReturnEmptyWhenLessonNotFound() {
        Long lessonId = 10L;

        when(lessonCoreService.findById(lessonId)).thenReturn(Optional.empty());

        Optional<LessonAdminDTO> result = adminLessonService.get(lessonId);

        assertTrue(result.isEmpty());

        verify(lessonCoreService).findById(lessonId);
        verifyNoInteractions(lessonMapper);
    }

    @Test
    void shouldReturnLessonsByCourse() {
        Long courseId = 1L;

        Lesson lesson1 = new Lesson();
        lesson1.setId(1L);
        lesson1.setTitle("Lesson 1");

        Lesson lesson2 = new Lesson();
        lesson2.setId(2L);
        lesson2.setTitle("Lesson 2");

        LessonAdminDTO dto1 = new LessonAdminDTO();
        dto1.setId(1L);

        LessonAdminDTO dto2 = new LessonAdminDTO();
        dto2.setId(2L);

        when(lessonCoreService.findByCourseId(courseId)).thenReturn(List.of(lesson1, lesson2));
        when(lessonMapper.toAdminDTO(lesson1)).thenReturn(dto1);
        when(lessonMapper.toAdminDTO(lesson2)).thenReturn(dto2);

        List<LessonAdminDTO> result = adminLessonService.listByCourse(courseId);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(2L, result.get(1).getId());

        verify(lessonCoreService).findByCourseId(courseId);
        verify(lessonMapper).toAdminDTO(lesson1);
        verify(lessonMapper).toAdminDTO(lesson2);
    }

    @Test
    void shouldBuildLessonFromDtoValuesOnCreate() {
        LessonUpsertDTO dto = new LessonUpsertDTO();
        dto.setCourseId(5L);
        dto.setTitle("Lesson title");
        dto.setContentText("Some content");
        dto.setYoutubeVideoId("video123");
        dto.setPdfRef("doc.pdf");
        dto.setOrderIndex(7);

        Lesson savedLesson = new Lesson();
        savedLesson.setId(1L);

        LessonAdminDTO adminDTO = new LessonAdminDTO();
        adminDTO.setId(1L);

        when(lessonCoreService.create(any(Lesson.class), eq(5L))).thenReturn(savedLesson);
        when(lessonMapper.toAdminDTO(savedLesson)).thenReturn(adminDTO);

        adminLessonService.create(dto);

        verify(lessonCoreService).create(argThat(lesson ->
                "Lesson title".equals(lesson.getTitle()) &&
                        "Some content".equals(lesson.getContentText()) &&
                        "video123".equals(lesson.getYoutubeVideoId()) &&
                        "doc.pdf".equals(lesson.getPdfRef()) &&
                        Integer.valueOf(7).equals(lesson.getOrderIndex())
        ), eq(5L));
    }

    @Test
    void shouldBuildLessonFromDtoValuesOnUpdate() {
        Long lessonId = 9L;

        LessonUpsertDTO dto = new LessonUpsertDTO();
        dto.setCourseId(3L);
        dto.setTitle("New title");
        dto.setContentText("New content");
        dto.setYoutubeVideoId("newVid");
        dto.setPdfRef("new.pdf");
        dto.setOrderIndex(4);

        Lesson savedLesson = new Lesson();
        savedLesson.setId(lessonId);

        LessonAdminDTO adminDTO = new LessonAdminDTO();
        adminDTO.setId(lessonId);

        when(lessonCoreService.update(eq(lessonId), any(Lesson.class), eq(3L))).thenReturn(savedLesson);
        when(lessonMapper.toAdminDTO(savedLesson)).thenReturn(adminDTO);

        adminLessonService.update(lessonId, dto);

        verify(lessonCoreService).update(eq(lessonId), argThat(lesson ->
                "New title".equals(lesson.getTitle()) &&
                        "New content".equals(lesson.getContentText()) &&
                        "newVid".equals(lesson.getYoutubeVideoId()) &&
                        "new.pdf".equals(lesson.getPdfRef()) &&
                        Integer.valueOf(4).equals(lesson.getOrderIndex())
        ), eq(3L));
    }
}