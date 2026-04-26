package com.esprit.microservice.courses.service.publicApi.formations;

import com.esprit.microservice.courses.dto.training.FormationDetailsDTO;

import java.util.List;

public interface LearnerFormationService {
    List<FormationDetailsDTO> getAllAvailableFormations();
    FormationDetailsDTO getAvailableFormationById(Long id);
}