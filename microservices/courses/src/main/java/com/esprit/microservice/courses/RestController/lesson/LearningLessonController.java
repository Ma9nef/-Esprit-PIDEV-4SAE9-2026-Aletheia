package com.esprit.microservice.courses.RestController.lesson;

import com.esprit.microservice.courses.dto.lesson.learning.LessonLearningDTO;
import com.esprit.microservice.courses.service.publicApi.LearningLessonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lesson/learn")
public class LearningLessonController {

    private final LearningLessonService learningLessonService;

    public LearningLessonController(LearningLessonService learningLessonService) {
        this.learningLessonService = learningLessonService;
    }

    // List published lessons of a course (archived=false)
    @GetMapping("/by-course/{courseId}")
    public ResponseEntity<List<LessonLearningDTO>> listByCourse(
            @PathVariable Long courseId,
            @RequestHeader(value = "X-USER-ID", required = false) String userIdHeader
    ) {
        Long userId = parseUserIdOrDefault(userIdHeader);
        return ResponseEntity.ok(learningLessonService.listCourseLessons(courseId, userId));
    }

    // Open one lesson if published (archived=false)
    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonLearningDTO> getLesson(
            @PathVariable Long lessonId,
            @RequestHeader(value = "X-USER-ID", required = false) String userIdHeader
    ) {
        Long userId = parseUserIdOrDefault(userIdHeader);

        return learningLessonService.getLesson(lessonId, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private Long parseUserIdOrDefault(String header) {
        if (header == null || header.isBlank()) return 1L; // dev default
        try { return Long.parseLong(header.trim()); }
        catch (NumberFormatException e) { return 1L; }
    }
}
