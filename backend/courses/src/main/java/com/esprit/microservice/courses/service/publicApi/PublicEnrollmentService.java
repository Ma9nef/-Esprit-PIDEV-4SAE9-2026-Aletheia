package com.esprit.microservice.courses.service.publicApi;

import com.esprit.microservice.courses.entity.progress.Enrollment;
import com.esprit.microservice.courses.service.core.EnrollmentCoreService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PublicEnrollmentService {

    private final EnrollmentCoreService core;

    public PublicEnrollmentService(EnrollmentCoreService core) {
        this.core = core;
    }

    public Enrollment enroll(Long userId, Long courseId) {
        return core.enroll(userId, courseId);
    }

    public List<Enrollment> myEnrollments(Long userId) {
        return core.myEnrollments(userId);
    }
}