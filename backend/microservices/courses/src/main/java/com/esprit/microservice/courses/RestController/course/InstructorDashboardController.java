package com.esprit.microservice.courses.RestController.course;

import com.esprit.microservice.courses.dto.InstructorCourseRowDTO;
import com.esprit.microservice.courses.repository.CourseRepository;
import com.esprit.microservice.courses.security.JwtReader;
import com.esprit.microservice.courses.service.instructor.InstructorDashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.*;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/instructor/dashboard")
public class InstructorDashboardController {

    private final InstructorDashboardService dashboardService;
    private final JwtReader jwtReader;
    private final CourseRepository courseRepository;
    public InstructorDashboardController(InstructorDashboardService dashboardService, JwtReader jwtReader, CourseRepository courseRepository) {
        this.dashboardService = dashboardService;
        this.jwtReader = jwtReader;
        this.courseRepository = courseRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> stats(@RequestHeader("Authorization") String auth) {
        Long instructorId = jwtReader.extractUserId(auth);

        long totalStudents = dashboardService.getTotalStudents(instructorId);
        long activeCourses = dashboardService.getActiveCourses(instructorId);

        return Map.of(
                "totalStudents", totalStudents,
                "activeCourses", activeCourses
        );
    }
    @GetMapping("/courses")
    public List<InstructorCourseRowDTO> myCourses(@RequestHeader("Authorization") String auth) {
        Long instructorId = jwtReader.extractUserId(auth);
        return dashboardService.getInstructorCoursesRows(instructorId);
    }
}

