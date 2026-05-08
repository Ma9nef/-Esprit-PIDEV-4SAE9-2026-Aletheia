package com.esprit.microservice.courses.service.admin;

import com.esprit.microservice.courses.dto.lesson.admin.LessonAdminDTO;
import com.esprit.microservice.courses.dto.lesson.command.LessonUpsertDTO;

import java.util.List;
import java.util.Optional;

public interface AdminLessonService {
    LessonAdminDTO create(LessonUpsertDTO dto);
    LessonAdminDTO update(Long lessonId, LessonUpsertDTO dto);
    void delete(Long lessonId);

    Optional<LessonAdminDTO> get(Long lessonId);
    List<LessonAdminDTO> listByCourse(Long courseId);
}
