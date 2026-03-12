package com.esprit.microservice.courses.service.mapper;

import com.esprit.microservice.courses.dto.lesson.admin.LessonAdminDTO;
import com.esprit.microservice.courses.dto.lesson.learning.LessonLearningDTO;
import com.esprit.microservice.courses.entity.content.Lesson;
import org.springframework.stereotype.Component;

@Component
public class LessonMapper {

    public LessonAdminDTO toAdminDTO(Lesson lesson) {
        if (lesson == null) return null;

        LessonAdminDTO dto = new LessonAdminDTO();
        dto.setId(lesson.getId());

        if (lesson.getCourse() != null) {
            dto.setCourseId(lesson.getCourse().getId());
        }

        dto.setTitle(lesson.getTitle());
        dto.setContentText(lesson.getContentText());
        dto.setYoutubeVideoId(lesson.getYoutubeVideoId());
        dto.setPdfRef(lesson.getPdfRef());
        dto.setOrderIndex(lesson.getOrderIndex());

        return dto;
    }

    public LessonLearningDTO toLearningDTO(Lesson lesson) {
        if (lesson == null) return null;

        LessonLearningDTO dto = new LessonLearningDTO();
        dto.setId(lesson.getId());

        // ✅ FIX: courseId was missing
        if (lesson.getCourse() != null) {
            dto.setCourseId(lesson.getCourse().getId());
        }

        dto.setTitle(lesson.getTitle());
        dto.setContentText(lesson.getContentText());
        dto.setYoutubeVideoId(lesson.getYoutubeVideoId());

        // ✅ Useful for frontend sorting (only if your LessonLearningDTO has it)
        // If LessonLearningDTO does NOT have these fields, delete these lines.
        try {
            dto.getClass().getMethod("setOrderIndex", Integer.class).invoke(dto, lesson.getOrderIndex());
        } catch (Exception ignored) {}

        // ✅ hasPdf based on pdfRef existence
        dto.setHasPdf(lesson.getPdfRef() != null && !lesson.getPdfRef().isBlank());

        return dto;
    }
}