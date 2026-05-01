package com.esprit.microservice.courses.service.publicApi.formations;

import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.entity.progress.FormationEnrollment;
import com.esprit.microservice.courses.repository.FormationEnrollmentRepository;
import com.esprit.microservice.courses.repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearnerFormationEnrollmentServiceImpl implements LearnerFormationEnrollmentService {

    private final FormationEnrollmentRepository formationEnrollmentRepository;
    private final FormationRepository formationRepository;

    public LearnerFormationEnrollmentServiceImpl(FormationEnrollmentRepository formationEnrollmentRepository,
                                                 FormationRepository formationRepository) {
        this.formationEnrollmentRepository = formationEnrollmentRepository;
        this.formationRepository = formationRepository;
    }

    @Override
    public FormationEnrollment enroll(Long userId, Long formationId) {
        if (formationEnrollmentRepository.existsByUserIdAndFormation_Id(userId, formationId)) {
            throw new RuntimeException("User is already enrolled in this formation");
        }

        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation not found with id: " + formationId));

        if (Boolean.TRUE.equals(formation.getArchived())) {
            throw new RuntimeException("You cannot enroll in an archived formation");
        }

        FormationEnrollment enrollment = new FormationEnrollment();
        enrollment.setUserId(userId);
        enrollment.setFormation(formation);

        return formationEnrollmentRepository.save(enrollment);
    }

    @Override
    public List<FormationEnrollment> getMyEnrollments(Long userId) {
        return formationEnrollmentRepository.findByUserId(userId);
    }
}