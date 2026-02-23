package tn.esprit.spring.exambl.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.spring.exambl.Entity.*;
import tn.esprit.spring.exambl.Repository.AssessmentRepository;
import tn.esprit.spring.exambl.Repository.QuestionOptionRepository;
import tn.esprit.spring.exambl.Repository.SubmissionRepository;
import tn.esprit.spring.exambl.Repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubmissionServiceImpl implements ISubmissionService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    AssessmentRepository assessmentRepository;
    @Autowired
    private SubmissionRepository submissionRepository;
    @Autowired
    private QuestionOptionRepository questionoptionRepository;

    @Override
    public Submission addSubmission(Submission submission) {
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(SubmissionStatus.SUBMITTED);
        return submissionRepository.save(submission);
    }

    @Override
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    @Override
    public Submission getSubmissionById(Long id) {
        return submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
    }

    @Override
    public Submission updateSubmission(Long id, Submission updatedSubmission) {
        Submission existing = getSubmissionById(id);

        existing.setScore(updatedSubmission.getScore());
        existing.setFeedback(updatedSubmission.getFeedback());
        existing.setStatus(SubmissionStatus.GRADED);

        return submissionRepository.save(existing);
    }
    @Override
    public Submission submitAndGradeQuiz(Long userId, Long assessmentId, List<Long> selectedOptionIds) {
        User user = userRepository.findById(userId).orElse(null);
        Assessment assessment = assessmentRepository.findById(assessmentId).orElse(null);

        if (user != null && assessment != null) {
            double finalScore = 0.0;

            // Loop through chosen options and calculate score
            for (Long optionId : selectedOptionIds) {
                QuestionOption option = questionoptionRepository.findById(optionId).orElse(null);
                if (option != null && option.isCorrect()) {
                    finalScore += option.getQuestion().getPoints();
                }
            }

            Submission submission = new Submission();
            submission.setUser(user);
            submission.setAssessment(assessment);
            submission.setSubmittedAt(LocalDateTime.now());
            submission.setScore(finalScore);
            submission.setStatus(SubmissionStatus.SUBMITTED);
            submission.setFeedback("Auto-graded: Score " + finalScore);

            return submissionRepository.save(submission);
        }
        return null;
    }
}
