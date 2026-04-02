package com.esprit.microservice.courses.RestController.lesson;

import com.esprit.microservice.courses.dto.lesson.learning.LessonLearningDTO;
import com.esprit.microservice.courses.security.JwtReader;
import com.esprit.microservice.courses.service.publicApi.LearningLessonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lesson/learn")
public class LearningLessonController {

    private final LearningLessonService learningLessonService;
    private final JwtReader jwtReader;

    public LearningLessonController(LearningLessonService learningLessonService, JwtReader jwtReader) {
        this.learningLessonService = learningLessonService;
        this.jwtReader = jwtReader;
    }

    // List published lessons of a course (archived=false)
    @GetMapping("/by-course/{courseId}")
    public ResponseEntity<List<LessonLearningDTO>> listByCourse(
            @PathVariable Long courseId,
            @RequestHeader("Authorization") String authorization
    ) {
        Long userId = jwtReader.extractUserId(authorization);
        return ResponseEntity.ok(learningLessonService.listCourseLessons(courseId, userId));
    }

    // Open one lesson if published (archived=false)
    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonLearningDTO> getLesson(
            @PathVariable Long lessonId,
            @RequestHeader("Authorization") String authorization
    ) {
        Long userId = jwtReader.extractUserId(authorization);

        return learningLessonService.getLesson(lessonId, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}