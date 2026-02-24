package com.esprit.microservice.courses.service.core;



import com.esprit.microservice.courses.entity.Question;

import java.util.List;

public interface IQuestionService {
    Question addQuestionAndOptions(Question question, Long assessmentId);
    List<Question> getQuestionsByAssessment(Long assessmentId);
    void deleteQuestion(Long id);
    Question updateQuestion(Long id, Question question);
}
