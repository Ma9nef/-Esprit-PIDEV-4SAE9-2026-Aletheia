package com.esprit.microservice.courses.service.admin;

import com.esprit.microservice.courses.dto.course.admin.CourseAdminDTO;
import com.esprit.microservice.courses.entity.Course;
import com.esprit.microservice.courses.service.core.CourseCoreService;
import com.esprit.microservice.courses.service.mapper.CourseMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminCourseServiceImpl implements AdminCourseService {

    private final CourseCoreService core;
    private final CourseMapper courseMapper;

    public AdminCourseServiceImpl(CourseCoreService core, CourseMapper courseMapper) {
        this.core = core;
        this.courseMapper = courseMapper;
    }

    @Override
    public Optional<CourseAdminDTO> getCourse(Long id) {
        return core.findById(id).map(courseMapper::toAdminDTO);
    }

    @Override
    public List<CourseAdminDTO> getCourses() {
        return core.findAll()
                .stream()
                .map(courseMapper::toAdminDTO)
                .toList();
    }

    @Override
    public CourseAdminDTO unarchive(Long id) {
        Course course = core.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + id));

        course.setArchived(false);
        return courseMapper.toAdminDTO(core.save(course));
    }

    @Override
    public CourseAdminDTO archive(Long id) {
        Course course = core.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + id));

        course.setArchived(true);
        return courseMapper.toAdminDTO(core.save(course));
    }
}
