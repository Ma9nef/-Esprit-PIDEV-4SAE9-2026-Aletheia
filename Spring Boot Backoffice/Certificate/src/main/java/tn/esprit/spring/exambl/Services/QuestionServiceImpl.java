package tn.esprit.spring.exambl.Services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.spring.exambl.Entity.Assessment;
import tn.esprit.spring.exambl.Entity.Question;
import tn.esprit.spring.exambl.Entity.QuestionOption;
import tn.esprit.spring.exambl.Repository.AssessmentRepository;
import tn.esprit.spring.exambl.Repository.QuestionRepository;

import java.util.List;

@Service
public class QuestionServiceImpl implements IQuestionService {

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    AssessmentRepository assessmentRepository;

    @Override
    @Transactional
    public Question addQuestionAndOptions(Question question, Long assessmentId) {
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
    public List<Question> getQuestionsByAssessment(Long assessmentId) {
        Assessment assessment = assessmentRepository.findById(assessmentId).orElse(null);
        return (assessment != null) ? assessment.getQuestions() : null;
    }
    @Override
    @Transactional
    public Question updateQuestion(Long id, Question updatedQuestion) {
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
