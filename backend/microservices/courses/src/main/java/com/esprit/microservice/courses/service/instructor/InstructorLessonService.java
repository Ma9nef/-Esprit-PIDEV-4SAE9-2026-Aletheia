package com.esprit.microservice.courses.service.instructor;

import com.esprit.microservice.courses.dto.lesson.admin.LessonAdminDTO;
import com.esprit.microservice.courses.dto.lesson.command.LessonUpsertDTO;

import java.util.List;
import java.util.Optional;

public interface InstructorLessonService {
    LessonAdminDTO create(LessonUpsertDTO dto);
    LessonAdminDTO update(Long lessonId, LessonUpsertDTO dto);

    Optional<LessonAdminDTO> get(Long lessonId);
    List<LessonAdminDTO> listByCourse(Long courseId);
}
