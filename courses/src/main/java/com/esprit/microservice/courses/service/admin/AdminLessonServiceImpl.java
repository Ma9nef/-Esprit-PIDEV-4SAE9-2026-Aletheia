package com.esprit.microservice.courses.service.admin;

import com.esprit.microservice.courses.dto.lesson.admin.LessonAdminDTO;
import com.esprit.microservice.courses.dto.lesson.command.LessonUpsertDTO;
import com.esprit.microservice.courses.entity.Lesson;
import com.esprit.microservice.courses.service.mapper.LessonMapper;
import com.esprit.microservice.courses.service.core.LessonCoreService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminLessonServiceImpl implements AdminLessonService {

    private final LessonCoreService lessonCoreService;
    private final LessonMapper lessonMapper;

    public AdminLessonServiceImpl(LessonCoreService lessonCoreService,
                                  LessonMapper lessonMapper) {
        this.lessonCoreService = lessonCoreService;
        this.lessonMapper = lessonMapper;
    }

    @Override
    public LessonAdminDTO create(LessonUpsertDTO dto) {
        Lesson lesson = buildLessonFromDto(dto);
        Lesson saved = lessonCoreService.create(lesson, dto.getCourseId());
        return lessonMapper.toAdminDTO(saved);
    }

    @Override
    public LessonAdminDTO update(Long lessonId, LessonUpsertDTO dto) {
        Lesson updated = buildLessonFromDto(dto);
        Lesson saved = lessonCoreService.update(lessonId, updated, dto.getCourseId());
        return lessonMapper.toAdminDTO(saved);
    }

    @Override
    public void delete(Long lessonId) {
        lessonCoreService.delete(lessonId);
    }

    @Override
    public Optional<LessonAdminDTO> get(Long lessonId) {
        return lessonCoreService.findById(lessonId)
                .map(lessonMapper::toAdminDTO);
    }

    @Override
    public List<LessonAdminDTO> listByCourse(Long courseId) {
        return lessonCoreService.findByCourseId(courseId)
                .stream()
                .map(lessonMapper::toAdminDTO)
                .toList();
    }

    private Lesson buildLessonFromDto(LessonUpsertDTO dto) {
        Lesson lesson = new Lesson();
        lesson.setTitle(dto.getTitle());
        lesson.setContentText(dto.getContentText());
        lesson.setYoutubeVideoId(dto.getYoutubeVideoId());
        lesson.setPdfRef(dto.getPdfRef());
        lesson.setOrderIndex(dto.getOrderIndex());
        return lesson;
    }
}
