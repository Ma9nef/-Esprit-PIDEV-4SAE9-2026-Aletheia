package com.esprit.microservice.courses.service.core;



import com.esprit.microservice.courses.entity.QuestionCertif;

import java.util.List;

public interface IQuestionService {
    QuestionCertif addQuestionAndOptions(QuestionCertif question, Long assessmentId);
    List<QuestionCertif> getQuestionsByAssessment(Long assessmentId);
    void deleteQuestion(Long id);
    QuestionCertif updateQuestion(Long id, QuestionCertif question);
}
