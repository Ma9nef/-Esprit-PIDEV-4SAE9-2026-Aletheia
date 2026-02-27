package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.content.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface CourseRepository extends JpaRepository<Course, Long> {

    Optional<Course> findByIdAndArchivedFalse(Long id);
    List<Course> findByArchivedFalse();

    List<Course> findByInstructorId(Long instructorId);
    Optional<Course> findByIdAndInstructorId(Long id, Long instructorId);
}