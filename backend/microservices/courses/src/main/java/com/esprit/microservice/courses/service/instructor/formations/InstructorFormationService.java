package com.esprit.microservice.courses.service.instructor.formations;


import com.esprit.microservice.courses.entity.formations.Formation;

import java.util.List;

public interface InstructorFormationService {

    Formation createFormation(Formation formation, Long instructorId);

    List<Formation> getFormationsByInstructor(Long instructorId);

    Formation getFormationByIdForInstructor(Long formationId, Long instructorId);

    Formation updateFormation(Long formationId, Long instructorId, Formation formation);
}