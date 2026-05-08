package com.esprit.microservice.courses.service.publicApi.formations;

import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearnerFormationServiceImpl implements LearnerFormationService {

    private final FormationRepository formationRepository;

    public LearnerFormationServiceImpl(FormationRepository formationRepository) {
        this.formationRepository = formationRepository;
    }

    @Override
    public List<Formation> getAllAvailableFormations() {
        return formationRepository.findByArchivedFalse();
    }

    @Override
    public Formation getAvailableFormationById(Long id) {
        Formation formation = formationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Formation not found with id: " + id));

        if (Boolean.TRUE.equals(formation.getArchived())) {
            throw new RuntimeException("Formation is not available");
        }

        return formation;
    }
}