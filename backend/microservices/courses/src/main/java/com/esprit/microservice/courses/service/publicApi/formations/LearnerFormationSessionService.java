package com.esprit.microservice.courses.service.publicApi.formations;

import com.esprit.microservice.courses.dto.training.FormationSessionDTO;

import java.util.List;

public interface LearnerFormationSessionService {

    List<FormationSessionDTO> getSessionsByFormation(Long formationId);
}