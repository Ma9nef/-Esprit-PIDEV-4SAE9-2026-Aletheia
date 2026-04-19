package com.esprit.microservice.courses.service.core;

import com.esprit.microservice.courses.service.core.UserClient;
import com.esprit.microservice.courses.dto.UserResponseDTO;
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

    @Autowired
    private UserClient userClient; // Inject the Feign Client

    @Override
    public Submission submitAndGradeQuiz(Long userId, Long assessmentId, List<Long> selectedOptionIds) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        // 1. Calculate Score
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

        // 2. Prepare Submission Entity
        Submission submission = new Submission();
        submission.setAssessment(assessment);
        submission.setScore(calculatedScore);
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(SubmissionStatus.GRADED);
        submission.setUserId(userId);
        submission.setFeedback(calculatedScore >= (assessment.getTotalScore() / 2.0) ? "Passed" : "Failed");

        // 3. CALL EXTERNAL MICROSERVICE VIA FEIGN
        try {
            UserResponseDTO user = userClient.getUserById(userId);
            submission.setLearnerName(user.getEmail()); // Set learnerName from User service email
        } catch (Exception e) {
            // If user service is down, we don't crash the app, just set a default
            submission.setLearnerName("Unknown User (ID: " + userId + ")");
        }

        return submissionRepository.save(submission);
    }

    @Override
    public Submission addSubmission(Submission s) {
        // Automatically fetch learner name if userId is present
        if (s.getUserId() != null && s.getLearnerName() == null) {
            try {
                UserResponseDTO user = userClient.getUserById(s.getUserId());
                s.setLearnerName(user.getEmail());
            } catch (Exception e) {
                s.setLearnerName("User fetch failed");
            }
        }
        return submissionRepository.save(s);
    }

    @Override public List<Submission> getAllSubmissions() { return submissionRepository.findAll(); }

    @Override public Submission getSubmissionById(Long id) { return submissionRepository.findById(id).orElse(null); }

    @Override
    public void deleteById(Long id) {
        if (!submissionRepository.existsById(id)) throw new RuntimeException("Submission not found");
        submissionRepository.deleteById(id);
    }

    @Override
    public Submission updateSubmission(Long id, Submission s) {
        s.setId(id);
        return submissionRepository.save(s);
    }
}