package com.esprit.microservice.courses.service.instructor;

import com.esprit.microservice.courses.dto.course.admin.CourseAdminDTO;
import com.esprit.microservice.courses.dto.course.command.CourseCreateDTO;
import com.esprit.microservice.courses.dto.course.command.CourseUpdateDTO;

import java.util.List;
import java.util.Optional;

public interface InstructorCourseService {
    CourseAdminDTO create(CourseCreateDTO dto);
    CourseAdminDTO update(Long id, CourseUpdateDTO dto);

    Optional<CourseAdminDTO> get(Long id);
    List<CourseAdminDTO> list();

}
