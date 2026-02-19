package tn.esprit.spring.exambl.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.exambl.Entity.Assessment;
import tn.esprit.spring.exambl.Entity.Question;
import tn.esprit.spring.exambl.Services.IAssessmentService;

import java.util.List;

@RestController
@RequestMapping("/assessment")
@CrossOrigin("*")
public class AssessmentController {

    @Autowired
    IAssessmentService assessmentService;

    // URL: POST http://localhost:8080/assessment/add
    @PostMapping("/add")
    public Assessment addAssessment(@RequestBody Assessment assessment) {
        return assessmentService.addAssessment(assessment);
    }

    // URL: GET http://localhost:8080/assessment/all
    @GetMapping("/all")
    public List<Assessment> getAllAssessments() {
        return assessmentService.getAllAssessments();
    }

    // URL: GET http://localhost:8080/assessment/get/1
    @GetMapping("/get/{id}")
    public Assessment getAssessment(@PathVariable Long id) {
        return assessmentService.getAssessmentById(id);
    }

    // URL: DELETE http://localhost:8080/assessment/delete/1
    @DeleteMapping("/delete/{id}")
    public void deleteAssessment(@PathVariable Long id) {
        assessmentService.deleteAssessment(id);
    }
    @GetMapping("/{id}/questions")
    public Assessment getQuizWithQuestions(@PathVariable Long id) {
        return assessmentService.getAssessmentWithQuestions(id);
    }

    // 2. Admin adds a new question to a specific Assessment
    @PostMapping("/{id}/add-question")
    public Question addQuestion(@PathVariable Long id, @RequestBody Question question) {
        return assessmentService.addQuestionToAssessment(id, question);
    }
}
