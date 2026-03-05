package com.esprit.microservice.courses.RestController.course;

import com.esprit.microservice.courses.dto.course.admin.CourseAdminDTO;
import com.esprit.microservice.courses.dto.course.command.CourseCreateDTO;
import com.esprit.microservice.courses.dto.course.command.CourseUpdateDTO;
import com.esprit.microservice.courses.service.instructor.InstructorCourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/instructor/courses")
public class InstructorCourseController {

    private final InstructorCourseService service;

    public InstructorCourseController(InstructorCourseService service) {
        this.service = service;
    }

    // ✅ List my courses (ownership by instructorId from JWT)
    @GetMapping
    public ResponseEntity<List<CourseAdminDTO>> listMine(
            @RequestHeader("Authorization") String bearer
    ) {
        return ResponseEntity.ok(service.listMine(bearer));
    }

    // ✅ Get a single course that belongs to me
    @GetMapping("/{id}")
    public ResponseEntity<CourseAdminDTO> getMine(
            @RequestHeader("Authorization") String bearer,
            @PathVariable Long id
    ) {
        return service.getMine(bearer, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Create course (archived=true waiting admin validation)
    @PostMapping
    public ResponseEntity<CourseAdminDTO> create(
            @RequestHeader("Authorization") String bearer,
            @RequestBody CourseCreateDTO dto
    ) {
        return ResponseEntity.status(201).body(service.create(bearer, dto));
    }

    // ✅ Update only if the course belongs to me (archived=true re-validation)
    @PutMapping("/{id}")
    public ResponseEntity<CourseAdminDTO> update(
            @RequestHeader("Authorization") String bearer,
            @PathVariable Long id,
            @RequestBody CourseUpdateDTO dto
    ) {
        return ResponseEntity.ok(service.update(bearer, id, dto));
    }
}