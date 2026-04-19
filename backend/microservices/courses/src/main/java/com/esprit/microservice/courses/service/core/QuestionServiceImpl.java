package com.esprit.microservice.courses.service.core;

import com.esprit.microservice.courses.entity.Assessment;
import com.esprit.microservice.courses.entity.QuestionCertif;
import com.esprit.microservice.courses.entity.QuestionOption;
import com.esprit.microservice.courses.repository.AssessmentRepository;
import com.esprit.microservice.courses.repository.QuestionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionServiceImpl implements IQuestionService {

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    AssessmentRepository assessmentRepository;

    @Override
    @Transactional
    public QuestionCertif addQuestionAndOptions(QuestionCertif question, Long assessmentId) {
        Assessment assessment = assessmentRepository.findById(assessmentId).orElse(null);
        if (assessment != null) {
            question.setAssessment(assessment);

            // Link each option to the question (IMPORTANT for JPA)
            if (question.getOptions() != null) {
                for (QuestionOption option : question.getOptions()) {
                    option.setQuestion(question);
                }
            }
            return questionRepository.save(question);
        }
        return null;
    }

    @Override
    public List<QuestionCertif> getQuestionsByAssessment(Long assessmentId) {
        Assessment assessment = assessmentRepository.findById(assessmentId).orElse(null);
        return (assessment != null) ? assessment.getQuestions() : null;
    }
    @Override
    @Transactional
    public QuestionCertif updateQuestion(Long id, QuestionCertif updatedQuestion) {
        return questionRepository.findById(id).map(existingQuestion -> {
            // 1. Update basic fields
            existingQuestion.setText(updatedQuestion.getText());
            existingQuestion.setPoints(updatedQuestion.getPoints());

            // 2. Optional: If you want to replace options during update
            if (updatedQuestion.getOptions() != null) {
                // Clear old options if needed or manage them
                for (QuestionOption option : updatedQuestion.getOptions()) {
                    option.setQuestion(existingQuestion);
                }
                existingQuestion.setOptions(updatedQuestion.getOptions());
            }

            return questionRepository.save(existingQuestion);
        }).orElse(null);
    }
    @Override
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }}
