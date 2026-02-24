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

    @PostMapping
    public ResponseEntity<CourseAdminDTO> create(@RequestBody CourseCreateDTO dto) {
        return ResponseEntity.status(201).body(service.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseAdminDTO> update(@PathVariable Long id, @RequestBody CourseUpdateDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // ✅ list all courses (later: only instructor's)
    @GetMapping
    public ResponseEntity<List<CourseAdminDTO>> list() {
        return ResponseEntity.ok(service.list());
    }

    // ✅ get one course
    @GetMapping("/{id}")
    public ResponseEntity<CourseAdminDTO> get(@PathVariable Long id) {
        return service.get(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
