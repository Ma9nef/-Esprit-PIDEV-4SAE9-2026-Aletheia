package com.esprit.microservice.courses.service.admin.formation;


import com.esprit.microservice.courses.entity.formations.Formation;

import java.util.List;

public interface AdminFormationService {

    List<Formation> getAllFormations();

    List<Formation> getArchivedFormations();

    List<Formation> getActiveFormations();

    Formation archiveFormation(Long formationId);

    Formation unarchiveFormation(Long formationId);
}
