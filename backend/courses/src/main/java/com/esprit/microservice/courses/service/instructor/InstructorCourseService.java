package com.esprit.microservice.courses.service.instructor;

import com.esprit.microservice.courses.dto.course.admin.CourseAdminDTO;
import com.esprit.microservice.courses.dto.course.command.CourseCreateDTO;
import com.esprit.microservice.courses.dto.course.command.CourseUpdateDTO;

import java.util.List;
import java.util.Optional;

public interface InstructorCourseService {
    CourseAdminDTO create(String bearer, CourseCreateDTO dto);
    CourseAdminDTO update(String bearer, Long id, CourseUpdateDTO dto);

    Optional<CourseAdminDTO> getMine(String bearer, Long id);
    List<CourseAdminDTO> listMine(String bearer);
}