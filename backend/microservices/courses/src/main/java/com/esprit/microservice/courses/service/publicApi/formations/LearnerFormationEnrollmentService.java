package com.esprit.microservice.courses.service.publicApi.formations;


import com.esprit.microservice.courses.dto.training.MyEnrolledFormationDTO;
import com.esprit.microservice.courses.entity.progress.FormationEnrollment;

import java.util.List;

public interface LearnerFormationEnrollmentService {
    FormationEnrollment enroll(Long userId, Long formationId);
    List<FormationEnrollment> getMyEnrollments(Long userId);
    public List<MyEnrolledFormationDTO> getMyEnrolledFormations(Long userId);
}