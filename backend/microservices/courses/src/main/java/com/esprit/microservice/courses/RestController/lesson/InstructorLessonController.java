package com.esprit.microservice.courses.RestController.lesson;

import com.esprit.microservice.courses.dto.lesson.admin.LessonAdminDTO;
import com.esprit.microservice.courses.dto.lesson.command.LessonUpsertDTO;
import com.esprit.microservice.courses.security.JwtReader;
import com.esprit.microservice.courses.service.instructor.InstructorLessonService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lesson/instructor")
public class InstructorLessonController {

    private final InstructorLessonService instructorLessonService;
    private final JwtReader jwtReader;

    public InstructorLessonController(
            InstructorLessonService instructorLessonService,
            JwtReader jwtReader
    ) {
        this.instructorLessonService = instructorLessonService;
        this.jwtReader = jwtReader;
    }

    @PostMapping
    public ResponseEntity<LessonAdminDTO> create(
            @RequestHeader("Authorization") String bearer,
            @Valid @RequestBody LessonUpsertDTO dto
    ) {
        jwtReader.extractUserId(bearer);
        return ResponseEntity.ok(instructorLessonService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LessonAdminDTO> update(
            @RequestHeader("Authorization") String bearer,
            @PathVariable Long id,
            @Valid @RequestBody LessonUpsertDTO dto
    ) {
        jwtReader.extractUserId(bearer);
        return ResponseEntity.ok(instructorLessonService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonAdminDTO> get(
            @RequestHeader("Authorization") String bearer,
            @PathVariable Long id
    ) {
        jwtReader.extractUserId(bearer);
        return instructorLessonService.get(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-course/{courseId}")
    public ResponseEntity<List<LessonAdminDTO>> listByCourse(
            @RequestHeader("Authorization") String bearer,
            @PathVariable Long courseId
    ) {
        jwtReader.extractUserId(bearer);
        return ResponseEntity.ok(instructorLessonService.listByCourse(courseId));
    }
}