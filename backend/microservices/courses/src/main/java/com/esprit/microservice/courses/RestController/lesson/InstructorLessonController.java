package com.esprit.microservice.courses.RestController.lesson;

import com.esprit.microservice.courses.dto.lesson.admin.LessonAdminDTO;
import com.esprit.microservice.courses.dto.lesson.command.LessonUpsertDTO;
import com.esprit.microservice.courses.service.instructor.InstructorLessonService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lesson/instructor")
public class InstructorLessonController {

    private final InstructorLessonService instructorLessonService;

    public InstructorLessonController(InstructorLessonService instructorLessonService) {
        this.instructorLessonService = instructorLessonService;
    }

    @PostMapping
    public ResponseEntity<LessonAdminDTO> create(@Valid @RequestBody LessonUpsertDTO dto) {
        return ResponseEntity.ok(instructorLessonService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LessonAdminDTO> update(@PathVariable Long id, @Valid @RequestBody LessonUpsertDTO dto) {
        return ResponseEntity.ok(instructorLessonService.update(id, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonAdminDTO> get(@PathVariable Long id) {
        return instructorLessonService.get(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-course/{courseId}")
    public ResponseEntity<List<LessonAdminDTO>> listByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(instructorLessonService.listByCourse(courseId));
    }
}
