package com.esprit.microservice.courses.RestController.certificateassesment;

import com.esprit.microservice.courses.entity.QuestionCertif;
import com.esprit.microservice.courses.service.core.IQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pidev/questions")
public class QuestionController {

    @Autowired
    IQuestionService questionService;

    // 1. Instructor adds a Question with its multiple choices
    @PostMapping("/add-to-assessment/{assessmentId}")
    public QuestionCertif addQuestion(@RequestBody QuestionCertif question, @PathVariable Long assessmentId) {
        return questionService.addQuestionAndOptions(question, assessmentId);
    }

    // 2. Student retrieves the list of questions for a Quiz
    @GetMapping("/assessment/{assessmentId}")
    public List<QuestionCertif> getByAssessment(@PathVariable Long assessmentId) {
        return questionService.getQuestionsByAssessment(assessmentId);
    }
    @PutMapping("/{id}")
    public QuestionCertif update(@PathVariable Long id, @RequestBody QuestionCertif question) {
        return questionService.updateQuestion(id, question);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        questionService.deleteQuestion(id);
    }
}