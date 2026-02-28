package com.esprit.microservice.courses.service.instructor;

import com.esprit.microservice.courses.dto.InstructorCourseRowDTO;
import com.esprit.microservice.courses.repository.CourseRepository;
import com.esprit.microservice.courses.repository.EnrollmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InstructorDashboardService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;

    public InstructorDashboardService(EnrollmentRepository enrollmentRepository, CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
    }

    public long getTotalStudents(Long instructorId) {
        return enrollmentRepository.countDistinctStudentsByInstructor(instructorId);
    }
    public long getActiveCourses(Long instructorId) {
        return courseRepository.countByInstructorIdAndArchivedFalse(instructorId);
    }
    public List<InstructorCourseRowDTO> getInstructorCoursesRows(Long instructorId) {
        return courseRepository.findInstructorCoursesRows(instructorId);
    }
}