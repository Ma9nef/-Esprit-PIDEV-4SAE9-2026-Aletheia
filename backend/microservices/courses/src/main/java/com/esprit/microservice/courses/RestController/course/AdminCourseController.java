package com.esprit.microservice.courses.RestController.course;

import com.esprit.microservice.courses.dto.course.admin.CourseAdminDTO;
import com.esprit.microservice.courses.service.admin.AdminCourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/course/admin")
public class AdminCourseController {

    private final AdminCourseService service;

    public AdminCourseController(AdminCourseService service) {
        this.service = service;
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<CourseAdminDTO> get(@PathVariable Long id) {
        return service.getCourse(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/courses")
    public List<CourseAdminDTO> list() {
        return service.getCourses();
    }

    // ✅ Archive course
    @PatchMapping("/courses/{id}/archive")
    public ResponseEntity<CourseAdminDTO> archive(@PathVariable Long id) {
        return ResponseEntity.ok(service.archive(id));
    }

    // ✅ Unarchive course
    @PatchMapping("/courses/{id}/unarchive")
    public ResponseEntity<CourseAdminDTO> unarchive(@PathVariable Long id) {
        return ResponseEntity.ok(service.unarchive(id));
    }
}
