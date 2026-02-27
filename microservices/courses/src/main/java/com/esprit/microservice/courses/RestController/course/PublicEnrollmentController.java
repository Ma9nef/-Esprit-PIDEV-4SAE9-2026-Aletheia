package com.esprit.microservice.courses.RestController.course;

import com.esprit.microservice.courses.security.JwtReader;
import com.esprit.microservice.courses.entity.Enrollment;
import com.esprit.microservice.courses.service.publicApi.PublicEnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/course/public/enrollments")
public class PublicEnrollmentController {

    private final PublicEnrollmentService service;
    private final JwtReader jwtReader;

    public PublicEnrollmentController(PublicEnrollmentService service, JwtReader jwtReader) {
        this.service = service;
        this.jwtReader = jwtReader;
    }

    @PostMapping("/{courseId}")
    public ResponseEntity<Enrollment> enroll(@PathVariable Long courseId,
                                             @RequestHeader("Authorization") String authorization) {
        Long userId = jwtReader.extractUserId(authorization);
        return ResponseEntity.status(201).body(service.enroll(userId, courseId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<Enrollment>> myEnrollments(@RequestHeader("Authorization") String authorization) {
        Long userId = jwtReader.extractUserId(authorization);
        return ResponseEntity.ok(service.myEnrollments(userId));
    }
}