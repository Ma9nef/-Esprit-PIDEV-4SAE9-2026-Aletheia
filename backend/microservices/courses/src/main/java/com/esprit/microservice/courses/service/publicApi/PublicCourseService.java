package com.esprit.microservice.courses.service.publicApi;

import com.esprit.microservice.courses.dto.course.publicDto.CoursePublicDTO;

import java.util.List;
import java.util.Optional;

public interface PublicCourseService {
    Optional<CoursePublicDTO> getCourse(Long id);
    List<CoursePublicDTO> getCourses();
}
