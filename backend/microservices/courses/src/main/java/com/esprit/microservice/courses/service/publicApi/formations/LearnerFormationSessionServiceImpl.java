package com.esprit.microservice.courses.service.publicApi.formations;

import com.esprit.microservice.courses.dto.training.FormationSessionDTO;
import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.entity.formations.FormationSession;
import com.esprit.microservice.courses.repository.FormationRepository;
import com.esprit.microservice.courses.repository.FormationSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearnerFormationSessionServiceImpl implements LearnerFormationSessionService {

    private final FormationSessionRepository formationSessionRepository;
    private final FormationRepository formationRepository;

    public LearnerFormationSessionServiceImpl(FormationSessionRepository formationSessionRepository,
                                              FormationRepository formationRepository) {
        this.formationSessionRepository = formationSessionRepository;
        this.formationRepository = formationRepository;
    }

    @Override
    public List<FormationSessionDTO> getSessionsByFormation(Long formationId) {
        Formation formation = formationRepository.findById(formationId)
                .orElseThrow(() -> new RuntimeException("Formation not found with id: " + formationId));

        if (Boolean.TRUE.equals(formation.getArchived())) {
            throw new RuntimeException("This formation is archived");
        }

        List<FormationSession> sessions =
                formationSessionRepository.findByFormation_IdOrderBySessionDateAscStartTimeAsc(formationId);

        return sessions.stream().map(session -> {
            FormationSessionDTO dto = new FormationSessionDTO();
            dto.setId(session.getId());
            dto.setFormationId(session.getFormation().getId());
            dto.setSessionDate(session.getSessionDate());
            dto.setStartTime(session.getStartTime());
            dto.setEndTime(session.getEndTime());
            dto.setRoom(session.getRoom());
            dto.setTopic(session.getTopic());
            return dto;
        }).toList();
    }
}