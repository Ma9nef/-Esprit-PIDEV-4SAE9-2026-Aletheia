package tn.esprit.spring.exambl.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.exambl.Entity.Submission;
import tn.esprit.spring.exambl.Services.ISubmissionService;

import java.util.List;

@RestController
@RequestMapping("/submissions")
public class SubmissionController {

    @Autowired
    ISubmissionService submissionService;

    @PostMapping("/submit-quiz")
    public Submission submitQuiz(@RequestBody Submission submission) {
        // Here you would calculate the score and save it
        return submissionService.addSubmission(submission);
    }
    @GetMapping
    public ResponseEntity<List<Submission>> getAllSubmissions() {
        return ResponseEntity.ok(submissionService.getAllSubmissions());
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Submission> getSubmissionById(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmissionById(id));
    }

    // ✅ UPDATE (for grading)
    @PutMapping("/{id}")
    public ResponseEntity<Submission> updateSubmission(
            @PathVariable Long id,
            @RequestBody Submission submission) {

        return ResponseEntity.ok(submissionService.updateSubmission(id, submission));
    }
    @PostMapping("/grade-quiz")
    public ResponseEntity<Submission> gradeQuiz(
            @RequestParam Long userId,
            @RequestParam Long assessmentId,
            @RequestBody List<Long> selectedOptionIds) {

        // This calls the advanced logic we wrote in the Service
        Submission gradedSubmission = submissionService.submitAndGradeQuiz(userId, assessmentId, selectedOptionIds);

        if (gradedSubmission == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(gradedSubmission);
    }

}
