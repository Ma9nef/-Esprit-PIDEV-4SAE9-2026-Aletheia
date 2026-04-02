package com.esprit.microservice.courses.RestController.course;

import com.esprit.microservice.courses.dto.course.publicDto.CoursePublicDTO;
import com.esprit.microservice.courses.service.publicApi.PublicCourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/course/public")
public class PublicCourseController {

    private final PublicCourseService service;

    public PublicCourseController(PublicCourseService service) {
        this.service = service;
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<CoursePublicDTO> get(@PathVariable Long id) {
        return service.getCourse(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/courses")
    public List<CoursePublicDTO> list() {
        return service.getCourses();
    }

}
