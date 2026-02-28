package com.esprit.microservice.courses.service.core;

import com.esprit.microservice.courses.entity.content.Course;

import java.util.List;
import java.util.Optional;

public interface CourseCoreService {
    Optional<Course> findById(Long id);
    Optional<Course> findPublicById(Long id);      // archived=false
    List<Course> findAll();
    List<Course> findPublicAll();                  // archived=false
    Course save(Course course);
    List<Course> findByInstructorId(Long instructorId);
    Optional<Course> findByIdAndInstructorId(Long id, Long instructorId);
}
