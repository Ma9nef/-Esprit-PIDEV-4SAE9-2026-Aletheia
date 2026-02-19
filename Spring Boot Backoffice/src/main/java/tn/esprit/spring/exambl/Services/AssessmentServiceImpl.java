package tn.esprit.spring.exambl.Services;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.spring.exambl.Entity.Assessment;
import tn.esprit.spring.exambl.Entity.Question;
import tn.esprit.spring.exambl.Repository.AssessmentRepository;
import tn.esprit.spring.exambl.Repository.QuestionRepository;

import java.util.List;

@Service
public class

AssessmentServiceImpl implements IAssessmentService {

    @Autowired
    AssessmentRepository assessmentRepository;
    @Autowired
    QuestionRepository questionRepository;


    @Override
    public Assessment addAssessment(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }

    @Override
    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    @Override
    public Assessment getAssessmentById(Long id) {
        return assessmentRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteAssessment(Long id) {
        assessmentRepository.deleteById(id);
    }
    @Override
    public Assessment getAssessmentWithQuestions(Long id) {
        // This will return the assessment along with the list of questions and their options
        return assessmentRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Question addQuestionToAssessment(Long assessmentId, Question question) {
        Assessment assessment = assessmentRepository.findById(assessmentId).orElse(null);
        if (assessment != null) {
            question.setAssessment(assessment);
            // Link options to the question before saving
            if (question.getOptions() != null) {
                question.getOptions().forEach(option -> option.setQuestion(question));
            }
            return questionRepository.save(question); // You'll need to create QuestionRepository
        }
        return null;
    }
}

