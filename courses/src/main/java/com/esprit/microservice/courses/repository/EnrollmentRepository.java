package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.progress.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByUserIdAndCourse_Id(Long userId, Long courseId);
    Optional<Enrollment> findByUserIdAndCourse_Id(Long userId, Long courseId);
    List<Enrollment> findAllByUserId(Long userId);
    List<Enrollment> findAllByCourse_Id(Long courseId);
}