package com.esprit.microservice.courses.RestController.formations;

import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.entity.progress.FormationEnrollment;
import com.esprit.microservice.courses.security.JwtReader;
import com.esprit.microservice.courses.service.publicApi.formations.LearnerFormationEnrollmentService;
import com.esprit.microservice.courses.service.publicApi.formations.LearnerFormationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formations")
public class PublicFormationController {

    private final LearnerFormationService learnerFormationService;
    private final LearnerFormationEnrollmentService learnerFormationEnrollmentService;
    private final JwtReader jwtReader;

    public PublicFormationController(
            LearnerFormationService learnerFormationService,
            LearnerFormationEnrollmentService learnerFormationEnrollmentService,
            JwtReader jwtReader
    ) {
        this.learnerFormationService = learnerFormationService;
        this.learnerFormationEnrollmentService = learnerFormationEnrollmentService;
        this.jwtReader = jwtReader;
    }

    @GetMapping
    public ResponseEntity<List<Formation>> getAllFormations() {
        return ResponseEntity.ok(learnerFormationService.getAllAvailableFormations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Formation> getFormationById(@PathVariable Long id) {
        return ResponseEntity.ok(learnerFormationService.getAvailableFormationById(id));
    }

    @PostMapping("/{formationId}/enroll")
    public ResponseEntity<FormationEnrollment> enrollInFormation(
            @PathVariable Long formationId,
            @RequestHeader("Authorization") String authorization
    ) {
        Long userId = jwtReader.extractUserId(authorization);

        return ResponseEntity.ok(
                learnerFormationEnrollmentService.enroll(userId, formationId)
        );
    }

    @GetMapping("/my-enrollments")
    public ResponseEntity<List<FormationEnrollment>> getMyEnrollments(
            @RequestHeader("Authorization") String authorization
    ) {
        Long userId = jwtReader.extractUserId(authorization);

        return ResponseEntity.ok(
                learnerFormationEnrollmentService.getMyEnrollments(userId)
        );
    }
}