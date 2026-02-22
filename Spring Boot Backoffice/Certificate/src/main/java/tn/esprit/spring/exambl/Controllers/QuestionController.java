package tn.esprit.spring.exambl.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.spring.exambl.Entity.Question;
import tn.esprit.spring.exambl.Services.IQuestionService;

import java.util.List;

@RestController
@RequestMapping("/questions")
@CrossOrigin("*")
public class QuestionController {

    @Autowired
    IQuestionService questionService;

    // 1. Instructor adds a Question with its multiple choices
    @PostMapping("/add-to-assessment/{assessmentId}")
    public Question addQuestion(@RequestBody Question question, @PathVariable Long assessmentId) {
        return questionService.addQuestionAndOptions(question, assessmentId);
    }

    // 2. Student retrieves the list of questions for a Quiz
    @GetMapping("/assessment/{assessmentId}")
    public List<Question> getByAssessment(@PathVariable Long assessmentId) {
        return questionService.getQuestionsByAssessment(assessmentId);
    }
    @PutMapping("/{id}")
    public Question update(@PathVariable Long id, @RequestBody Question question) {
        return questionService.updateQuestion(id, question);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        questionService.deleteQuestion(id);
    }
}