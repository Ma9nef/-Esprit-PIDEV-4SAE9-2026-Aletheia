package tn.esprit.spring.exambl.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.exambl.Entity.Assessment;
import tn.esprit.spring.exambl.Entity.Question;
import tn.esprit.spring.exambl.Entity.QuestionOption;
import tn.esprit.spring.exambl.Services.IAssessmentService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/assessment")
@CrossOrigin(origins = "http://localhost:4200")
public class AssessmentController {

    @Autowired
    IAssessmentService assessmentService;

    // Create a whole Assessment (including its Questions and Options)
    @PostMapping(value="/add", consumes="application/json", produces="application/json")
    public Assessment addAssessment(@RequestBody Assessment assessment){
        return assessmentService.addAssessment(assessment);
    }

    // Update the whole Assessment (this replaces/updates Questions/Options via Cascade)
    @PutMapping("/update/{id}")
    public ResponseEntity<Assessment> updateAssessment(@PathVariable Long id, @RequestBody Assessment assessment) {
        return ResponseEntity.ok(assessmentService.updateAssessment(id, assessment));
    }

    @GetMapping("/all")
    public List<Assessment> getAllAssessments() {
        return assessmentService.getAllAssessments();
    }

    @GetMapping("/get/{id}")
    public Assessment getAssessment(@PathVariable Long id) {
        return assessmentService.getAssessmentById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteAssessment(@PathVariable Long id) {
        assessmentService.deleteAssessment(id);
    }

    // Submission logic: Calculates the score based on provided answers
    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitQuiz(@PathVariable Long id, @RequestBody Map<Long, Long> answers) {
        try {
            // Retrieve assessment (ensure your service/repo fetches questions/options)
            Assessment assessment = assessmentService.getAssessmentById(id);

            if (assessment == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Assessment not found"));
            }

            double totalScore = 0;
            double earnedScore = 0;
            int correctAnswersCount = 0;
            int totalQuestions = assessment.getQuestions().size();

            for (Question question : assessment.getQuestions()) {
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