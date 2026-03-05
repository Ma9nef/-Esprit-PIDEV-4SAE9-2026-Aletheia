package com.esprit.microservice.courses.RestController.lesson;

import com.esprit.microservice.courses.dto.lesson.publicDto.CourseProgressResponseDTO;
import com.esprit.microservice.courses.security.JwtReader;
import com.esprit.microservice.courses.service.core.LessonCoreService;
import com.esprit.microservice.courses.service.core.LessonProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/progress")
public class ProgressController {

    private final LessonProgressService progressService;
    private final LessonCoreService lessonCoreService;
    private final JwtReader jwtReader;

    public ProgressController(
            LessonProgressService progressService,
            LessonCoreService lessonCoreService,
            JwtReader jwtReader
    ) {
        this.progressService = progressService;
        this.lessonCoreService = lessonCoreService;
        this.jwtReader = jwtReader;
    }

    // ✅ Mark lesson completed
    @PostMapping("/courses/{courseId}/lessons/{lessonId}/complete")
    public ResponseEntity<CourseProgressResponseDTO> completeLesson(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long courseId,
            @PathVariable Long lessonId
    ) {

        Long userId = jwtReader.extractUserId(authorization);

        progressService.markCompleted(userId, courseId, lessonId);

        long completed = progressService.countCompleted(userId, courseId);
        long total = lessonCoreService.countByCourseId(courseId);

        int percent = total > 0
                ? (int) Math.round((completed * 100.0) / total)
                : 0;

        return ResponseEntity.ok(
                new CourseProgressResponseDTO(percent, completed, total)
        );
    }

    // ✅ Get progress
    @GetMapping("/courses/{courseId}")
    public ResponseEntity<CourseProgressResponseDTO> getProgress(
            @RequestHeader("Authorization") String authorization,
            @PathVariable Long courseId
    ) {

        Long userId = jwtReader.extractUserId(authorization);

        long completed = progressService.countCompleted(userId, courseId);
        long total = lessonCoreService.countByCourseId(courseId);

        int percent = total > 0
                ? (int) Math.round((completed * 100.0) / total)
                : 0;

        return ResponseEntity.ok(
                new CourseProgressResponseDTO(percent, completed, total)
        );
    }
}