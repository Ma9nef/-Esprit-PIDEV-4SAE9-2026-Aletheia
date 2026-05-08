package com.esprit.microservice.courses.service.publicApi.formations;



import com.esprit.microservice.courses.entity.formations.Formation;

import java.util.List;

public interface LearnerFormationService {
    List<Formation> getAllAvailableFormations();
    Formation getAvailableFormationById(Long id);
}