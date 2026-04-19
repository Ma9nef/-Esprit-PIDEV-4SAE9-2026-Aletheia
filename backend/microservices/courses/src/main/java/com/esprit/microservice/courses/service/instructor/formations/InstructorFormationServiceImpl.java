package com.esprit.microservice.courses.service.instructor.formations;

import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InstructorFormationServiceImpl implements InstructorFormationService {

    private final FormationRepository formationRepository;

    public InstructorFormationServiceImpl(FormationRepository formationRepository) {
        this.formationRepository = formationRepository;
    }

    @Override
    public Formation createFormation(Formation formation, Long instructorId) {
        formation.setId(null);
        formation.setInstructorId(instructorId);
        formation.setArchived(true);
        return formationRepository.save(formation);
    }

    @Override
    public List<Formation> getFormationsByInstructor(Long instructorId) {
        return formationRepository.findByInstructorId(instructorId);
    }

    @Override
    public Formation getFormationByIdForInstructor(Long formationId, Long instructorId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation not found with id: " + formationId));

        if (!formation.getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You are not allowed to access this formation");
        }

        return formation;
    }

    @Override
    public Formation updateFormation(Long formationId, Long instructorId, Formation updatedFormation) {
        Formation existingFormation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation not found with id: " + formationId));

        if (!existingFormation.getInstructorId().equals(instructorId)) {
            throw new RuntimeException("You are not allowed to update this formation");
        }

        existingFormation.setTitle(updatedFormation.getTitle());
        existingFormation.setDescription(updatedFormation.getDescription());
        existingFormation.setDuration(updatedFormation.getDuration());
        existingFormation.setCapacity(updatedFormation.getCapacity());

        existingFormation.setLocation(updatedFormation.getLocation());
        existingFormation.setStartDate(updatedFormation.getStartDate());
        existingFormation.setEndDate(updatedFormation.getEndDate());
        existingFormation.setLevel(updatedFormation.getLevel());
        existingFormation.setObjective(updatedFormation.getObjective());
        existingFormation.setPrerequisites(updatedFormation.getPrerequisites());

        return formationRepository.save(existingFormation);
    }
}