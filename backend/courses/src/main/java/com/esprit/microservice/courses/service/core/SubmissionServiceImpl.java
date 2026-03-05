package com.esprit.microservice.courses.service.core;

import com.esprit.microservice.courses.entity.*;
import com.esprit.microservice.courses.repository.AssessmentRepository;
import com.esprit.microservice.courses.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubmissionServiceImpl implements ISubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Override
    public Submission submitAndGradeQuiz(Long userId, Long assessmentId, List<Long> selectedOptionIds) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Examen non trouvé"));

        int correctAnswersCount = 0;
        for (QuestionCertif question : assessment.getQuestions()) {
            for (QuestionOption option : question.getOptions()) {
                if (option.isCorrect() && selectedOptionIds.contains(option.getId())) {
                    correctAnswersCount++;
                }
            }
        }

        double calculatedScore = 0;
        if (!assessment.getQuestions().isEmpty()) {
            calculatedScore = ((double) correctAnswersCount / assessment.getQuestions().size()) * assessment.getTotalScore();
        }

        Submission submission = new Submission();
        submission.setAssessment(assessment);
        submission.setScore(calculatedScore);
        submission.setSubmittedAt(LocalDateTime.now());

        // CORRECTION : Utiliser l'Enum que vous avez défini
        submission.setStatus(SubmissionStatus.GRADED);

        submission.setFeedback(calculatedScore >= (assessment.getTotalScore() / 2.0) ? "Réussi" : "Échoué");

        return submissionRepository.save(submission);
    }

    @Override public List<Submission> getAllSubmissions() { return submissionRepository.findAll(); }
    @Override public Submission addSubmission(Submission s) { return submissionRepository.save(s); }
    @Override public Submission getSubmissionById(Long id) { return submissionRepository.findById(id).orElse(null); }
    @Override public Submission updateSubmission(Long id, Submission s) { s.setId(id); return submissionRepository.save(s); }
}