package com.esprit.microservice.courses.RestController.course;

import com.esprit.microservice.courses.dto.CourseMiniDTO;
import com.esprit.microservice.courses.dto.MenuCategoryDTO;
import com.esprit.microservice.courses.repository.CourseRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final CourseRepository courseRepository;

    public CatalogController(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    // 1) Mega-menu data
    @GetMapping("/menu")
    public List<MenuCategoryDTO> menu() {
        return courseRepository.findDistinctCategories()
                .stream()
                .map(cat -> new MenuCategoryDTO(cat, courseRepository.findDistinctSubCategories(cat)))
                .toList();
    }

    // 2) Top courses (right column)
    @GetMapping("/top")
    public List<CourseMiniDTO> topCourses(
            @RequestParam String category,
            @RequestParam(required = false) String subCategory,
            @RequestParam(defaultValue = "10") int limit
    ) {
        int safeLimit = Math.min(Math.max(limit, 1), 20);
        return courseRepository.findTopCoursesForExplore(
                category, subCategory, PageRequest.of(0, safeLimit)
        );
    }
}