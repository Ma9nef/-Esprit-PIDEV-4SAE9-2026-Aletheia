package com.esprit.microservice.courses.service.core;



import com.esprit.microservice.courses.entity.Submission;

import java.util.List;

public interface ISubmissionService {
    Submission addSubmission(Submission submission);

    List<Submission> getAllSubmissions();

    Submission getSubmissionById(Long id);
    void deleteById(Long id);
    Submission updateSubmission(Long id, Submission submission);
    Submission submitAndGradeQuiz(Long userId, Long assessmentId, List<Long> selectedOptionIds);
}
