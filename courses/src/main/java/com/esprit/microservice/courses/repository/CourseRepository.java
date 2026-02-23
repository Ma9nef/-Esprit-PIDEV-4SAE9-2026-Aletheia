package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findById(Long id);
    Optional<Course> findByIdAndArchivedFalse(Long id);

    List<Course> findByArchivedFalse();


}
