package com.esprit.microservice.courses.service.core;

import com.esprit.microservice.courses.entity.content.Course;
import com.esprit.microservice.courses.entity.progress.Enrollment;
import com.esprit.microservice.courses.repository.CourseRepository;
import com.esprit.microservice.courses.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnrollmentCoreService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public EnrollmentCoreService(EnrollmentRepository enrollmentRepository,
                                 CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional
    public Enrollment enroll(Long userId, Long courseId) {
        Course course = courseRepository.findByIdAndArchivedFalse(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found or archived"));

        if (enrollmentRepository.existsByUserIdAndCourse_Id(userId, courseId)) {
            throw new IllegalStateException("Already enrolled");
        }

        return enrollmentRepository.save(new Enrollment(userId, course));
    }

    public List<Enrollment> myEnrollments(Long userId) {
        return enrollmentRepository.findAllByUserId(userId);
    }
}