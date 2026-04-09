package com.esprit.microservice.courses.RestController.certificateassesment;

import com.esprit.microservice.courses.entity.Submission;
import com.esprit.microservice.courses.security.JwtReader; // Import your JWT reader
import com.esprit.microservice.courses.service.core.ISubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assessment-results")

public class SubmissionController {

    @Autowired
    private ISubmissionService submissionService;

    @Autowired
    private JwtReader jwtReader; // Added for security consistency

    // 1. Get All Submissions (The one you requested)
    @GetMapping("/all")
    public ResponseEntity<List<Submission>> getAllSubmissions(
            @RequestHeader("Authorization") String authorization) {

        jwtReader.extractUserId(authorization);
        return ResponseEntity.ok(submissionService.getAllSubmissions());
    }

    // 2. Save Result (Updated with Security)
    @PostMapping
    public ResponseEntity<Submission> saveResult(
            @RequestBody Map<String, Object> payload,
            @RequestHeader("Authorization") String authorization) {

        // Extract learner ID directly from JWT for better security
        Long learnerIdFromToken = jwtReader.extractUserId(authorization);

        Long assessmentId = Long.valueOf(payload.get("assessmentId").toString());

        Map<String, Object> answersMap = (Map<String, Object>) payload.get("answers");
        List<Long> selectedOptionIds = new ArrayList<>();

        if (answersMap != null) {
            for (Object value : answersMap.values()) {
                selectedOptionIds.add(Long.valueOf(value.toString()));
            }
        }

        Submission submission = submissionService.submitAndGradeQuiz(learnerIdFromToken, assessmentId, selectedOptionIds);
        return ResponseEntity.ok(submission);
    }

    // 3. Delete a Submission (To help with your DB issue)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteSubmission(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorization) {

        jwtReader.extractUserId(authorization);
        submissionService.deleteById(id);  // ✅ UNCOMMENT THIS
        return ResponseEntity.ok(Map.of("message", "Submission deleted"));
    }


}