package com.esprit.microservice.courses.service.core;



import com.esprit.microservice.courses.entity.Assessment;

import java.util.List;

public interface IAssessmentService {
    Assessment addAssessment(Assessment assessment);
    Assessment updateAssessment(Long id, Assessment assessment);
    List<Assessment> getAllAssessments();
    Assessment getAssessmentById(Long id);
    void deleteAssessment(Long id);
    ;
  ;
 ;

}