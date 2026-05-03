package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.progress.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    boolean existsByUserIdAndCourse_Id(Long userId, Long courseId);
    Optional<Enrollment> findByUserIdAndCourse_Id(Long userId, Long courseId);
    List<Enrollment> findAllByUserId(Long userId);
    List<Enrollment> findAllByCourse_Id(Long courseId);
    @Query(value = """
        SELECT COUNT(DISTINCT e.user_id)
        FROM enrollments e
        JOIN course c ON c.id = e.course_id
        WHERE c.instructor_id = :instructorId
    """, nativeQuery = true)
    long countDistinctStudentsByInstructor(@Param("instructorId") Long instructorId);
}