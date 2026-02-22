package tn.esprit.spring.exambl.Services;

import tn.esprit.spring.exambl.Entity.Question;

import java.util.List;

public interface IQuestionService {
    Question addQuestionAndOptions(Question question, Long assessmentId);
    List<Question> getQuestionsByAssessment(Long assessmentId);
    void deleteQuestion(Long id);
    Question updateQuestion(Long id, Question question);
}
