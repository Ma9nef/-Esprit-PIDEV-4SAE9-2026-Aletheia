package com.esprit.microservice.courses.service.core;

import com.esprit.microservice.courses.entity.Assessment;
import com.esprit.microservice.courses.repository.AssessmentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
;

import java.util.List;

@Service
public class AssessmentServiceImpl implements IAssessmentService {

    @Autowired
    AssessmentRepository assessmentRepository;

    @Override
    @Transactional
    public Assessment addAssessment(Assessment assessment) {
        return assessmentRepository.save(assessment);
    }

    @Override
    @Transactional
    public Assessment updateAssessment(Long id, Assessment assessment) {
        Assessment existingAssessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        // Update main fields
        existingAssessment.setTitle(assessment.getTitle());
        existingAssessment.setType(assessment.getType());
        existingAssessment.setTotalScore(assessment.getTotalScore());
        existingAssessment.setDueDate(assessment.getDueDate());

        // Update the Question list
        if (assessment.getQuestions() != null) {
            existingAssessment.getQuestions().clear();
            assessment.getQuestions().forEach(q -> {
                q.setAssessment(existingAssessment);
                if (q.getOptions() != null) {
                    q.getOptions().forEach(o -> {
                        // DEBUG LINE: Check your console/terminal when you click save
                        System.out.println("DEBUG: Option '" + o.getOptionText() + "' isCorrect is: " + o.isCorrect());

                        o.setQuestion(q);
                    });
                }
                existingAssessment.getQuestions().add(q);
            });
        }
        return assessmentRepository.saveAndFlush(existingAssessment); // Use saveAndFlush
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
}