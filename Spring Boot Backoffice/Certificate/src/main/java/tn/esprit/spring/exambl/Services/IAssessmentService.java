package tn.esprit.spring.exambl.Services;

import tn.esprit.spring.exambl.Entity.Assessment;
;
import tn.esprit.spring.exambl.Entity.Question;
import tn.esprit.spring.exambl.Entity.QuestionOption;

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