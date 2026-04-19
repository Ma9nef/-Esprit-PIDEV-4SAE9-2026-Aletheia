package com.esprit.microservice.courses.service.admin;

import com.esprit.microservice.courses.dto.course.admin.CourseAdminDTO;

import java.util.List;
import java.util.Optional;

public interface AdminCourseService {
    Optional<CourseAdminDTO> getCourse(Long id);
    List<CourseAdminDTO> getCourses();

    CourseAdminDTO unarchive(Long id);
    CourseAdminDTO archive(Long id);
}
