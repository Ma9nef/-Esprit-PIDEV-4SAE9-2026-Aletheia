package tn.esprit.spring.exambl.Services;

import tn.esprit.spring.exambl.Entity.Assessment;
import tn.esprit.spring.exambl.Entity.Question;

import java.util.List;

public interface IAssessmentService {
    Assessment addAssessment(Assessment assessment);
    List<Assessment> getAllAssessments();
    Assessment getAssessmentById(Long id);
    void deleteAssessment(Long id);
    Assessment getAssessmentWithQuestions(Long id);
    Question addQuestionToAssessment(Long assessmentId, Question question);
}