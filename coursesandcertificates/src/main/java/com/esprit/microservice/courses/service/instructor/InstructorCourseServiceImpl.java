package com.esprit.microservice.courses.service.instructor;

import com.esprit.microservice.courses.dto.course.admin.CourseAdminDTO;
import com.esprit.microservice.courses.dto.course.command.CourseCreateDTO;
import com.esprit.microservice.courses.dto.course.command.CourseUpdateDTO;
import com.esprit.microservice.courses.entity.Course;
import com.esprit.microservice.courses.service.core.CourseCoreService;
import com.esprit.microservice.courses.service.mapper.CourseMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InstructorCourseServiceImpl implements InstructorCourseService {

    private final CourseCoreService core;
    private final CourseMapper courseMapper;

    public InstructorCourseServiceImpl(CourseCoreService core, CourseMapper courseMapper) {
        this.core = core;
        this.courseMapper = courseMapper;
    }

    @Override
    public CourseAdminDTO create(CourseCreateDTO dto) {
        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setInstructorName(dto.getInstructorName());
        course.setPrice(dto.getPrice());
        course.setDurationHours(dto.getDurationHours());

        // Instructor creates -> waiting admin validation
        course.setArchived(true);

        Course saved = core.save(course);
        return courseMapper.toAdminDTO(saved);
    }

    @Override
    public CourseAdminDTO update(Long id, CourseUpdateDTO dto) {
        Course course = core.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + id));

        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setInstructorName(dto.getInstructorName());
        course.setPrice(dto.getPrice());
        course.setDurationHours(dto.getDurationHours());

        // Any modification -> re-validation required
        course.setArchived(true);

        Course saved = core.save(course);
        return courseMapper.toAdminDTO(saved);
    }

    @Override
    public Optional<CourseAdminDTO> get(Long id) {
        return core.findById(id).map(courseMapper::toAdminDTO);
    }

    @Override
    public List<CourseAdminDTO> list() {
        // later: filter by instructor (when you have auth)
        return core.findAll().stream()
                .map(courseMapper::toAdminDTO)
                .toList();
    }


}
