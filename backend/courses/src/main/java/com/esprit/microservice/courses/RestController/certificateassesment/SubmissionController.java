package com.esprit.microservice.courses.RestController.certificateassesment;





import com.esprit.microservice.courses.entity.Submission;
import com.esprit.microservice.courses.service.core.ISubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController // Indispensable
@RequestMapping("/api/assessment-results") // Doit correspondre exactement à Angular
@CrossOrigin(origins = "*") // Autorise les requêtes depuis Angular
public class SubmissionController {

    @Autowired
    private ISubmissionService submissionService;

    @PostMapping
    public Submission saveResult(@RequestBody Map<String, Object> payload) {
        Long assessmentId = Long.valueOf(payload.get("assessmentId").toString());
        Long learnerId = Long.valueOf(payload.get("learnerId").toString());

        Map<String, Object> answersMap = (Map<String, Object>) payload.get("answers");
        List<Long> selectedOptionIds = new ArrayList<>();

        if (answersMap != null) {
            for (Object value : answersMap.values()) {
                selectedOptionIds.add(Long.valueOf(value.toString()));
            }
        }
        return submissionService.submitAndGradeQuiz(learnerId, assessmentId, selectedOptionIds);
    }
    @GetMapping("/hello") // Ajoutez ceci pour tester
    public String hello() {
        return "Le contrôleur est bien chargé !";
    }
}