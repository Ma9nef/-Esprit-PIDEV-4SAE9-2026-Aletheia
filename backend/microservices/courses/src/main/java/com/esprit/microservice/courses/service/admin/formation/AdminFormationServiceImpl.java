package com.esprit.microservice.courses.service.admin.formation;

import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.repository.FormationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminFormationServiceImpl implements AdminFormationService {

    private final FormationRepository formationRepository;

    public AdminFormationServiceImpl(FormationRepository formationRepository) {
        this.formationRepository = formationRepository;
    }

    @Override
    public List<Formation> getAllFormations() {
        return formationRepository.findAll();
    }

    @Override
    public List<Formation> getArchivedFormations() {
        return formationRepository.findByArchivedTrue();
    }

    @Override
    public List<Formation> getActiveFormations() {
        return formationRepository.findByArchivedFalse();
    }

    @Override
    public Formation archiveFormation(Long formationId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation not found with id: " + formationId));

        formation.setArchived(true);
        return formationRepository.save(formation);
    }

    @Override
    public Formation unarchiveFormation(Long formationId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation not found with id: " + formationId));

        formation.setArchived(false);
        return formationRepository.save(formation);
    }
}