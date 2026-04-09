package com.esprit.microservice.courses.RestController.certificateassesment;

import com.esprit.microservice.courses.entity.Assessment;
import com.esprit.microservice.courses.entity.QuestionCertif;
import com.esprit.microservice.courses.entity.QuestionOption;
import com.esprit.microservice.courses.security.JwtReader; // Import JwtReader
import com.esprit.microservice.courses.service.core.IAssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/pidev/assessment")
public class AssessmentController {

    private final IAssessmentService assessmentService;
    private final JwtReader jwtReader;

    // Use Constructor Injection (Best Practice)
    public AssessmentController(IAssessmentService assessmentService, JwtReader jwtReader) {
        this.assessmentService = assessmentService;
        this.jwtReader = jwtReader;
    }

    // Create a whole Assessment
    @PostMapping(value="/add", consumes="application/json", produces="application/json")
    public Assessment addAssessment(
            @RequestBody Assessment assessment,
            @RequestHeader("Authorization") String authorization) {

        jwtReader.extractUserId(authorization); // Validate token
        return assessmentService.addAssessment(assessment);
    }

    // Update Assessment
    @PutMapping("/update/{id}")
    public ResponseEntity<Assessment> updateAssessment(
            @PathVariable Long id,
            @RequestBody Assessment assessment,
            @RequestHeader("Authorization") String authorization) {

        jwtReader.extractUserId(authorization);
        return ResponseEntity.ok(assessmentService.updateAssessment(id, assessment));
    }

    @GetMapping("/all")
    public List<Assessment> getAllAssessments(
            @RequestHeader("Authorization") String authorization) {

        jwtReader.extractUserId(authorization);
        return assessmentService.getAllAssessments();
    }

    @GetMapping("/get/{id}")
    public Assessment getAssessment(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorization) {

        jwtReader.extractUserId(authorization);
        return assessmentService.getAssessmentById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteAssessment(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorization) {

        jwtReader.extractUserId(authorization);
        assessmentService.deleteAssessment(id);
    }

    // Submission logic: Calculates the score based on provided answers
    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitQuiz(
            @PathVariable Long id,
            @RequestBody Map<Long, Long> answers,
            @RequestHeader("Authorization") String authorization) {

        // Extract userId from token (useful if you want to save the result for this specific user)
        Long userId = jwtReader.extractUserId(authorization);

        try {
            Assessment assessment = assessmentService.getAssessmentById(id);

            if (assessment == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Assessment not found"));
            }

            double totalScore = 0;
            double earnedScore = 0;
            int correctAnswersCount = 0;
            int totalQuestions = assessment.getQuestions().size();

            for (QuestionCertif question : assessment.getQuestions()) {
                totalScore += (question.getPoints() != null) ? question.getPoints() : 0;

                Long selectedOptionId = answers.get(question.getId());
                if (selectedOptionId != null) {
                    QuestionOption selectedOption = question.getOptions().stream()
                            .filter(opt -> opt.getId().equals(selectedOptionId))
                            .findFirst()
                            .orElse(null);

                    if (selectedOption != null && selectedOption.isCorrect()) {
                        earnedScore += (question.getPoints() != null) ? question.getPoints() : 0;
                        correctAnswersCount++;
                    }
                }
            }

            double percentage = totalScore > 0 ? (earnedScore / totalScore) * 100 : 0;

            Map<String, Object> result = new HashMap<>();
            result.put("userId", userId); // Include who took the test
            result.put("score", earnedScore);
            result.put("totalScore", totalScore);
            result.put("percentage", Math.round(percentage * 100.0) / 100.0);
            result.put("correctAnswers", correctAnswersCount);
            result.put("totalQuestions", totalQuestions);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}