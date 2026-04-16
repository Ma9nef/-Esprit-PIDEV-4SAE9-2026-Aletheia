package com.esprit.microservice.courses.RestController.formations;

import com.esprit.microservice.courses.dto.training.FormationDetailsDTO;
import com.esprit.microservice.courses.dto.training.FormationSessionDTO;
import com.esprit.microservice.courses.dto.training.MyEnrolledFormationDTO;
import com.esprit.microservice.courses.entity.progress.FormationEnrollment;
import com.esprit.microservice.courses.security.JwtReader;
import com.esprit.microservice.courses.service.publicApi.formations.LearnerFormationEnrollmentService;
import com.esprit.microservice.courses.service.publicApi.formations.LearnerFormationService;
import com.esprit.microservice.courses.service.publicApi.formations.LearnerFormationSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formations")
public class PublicFormationController {

    private final LearnerFormationService learnerFormationService;
    private final LearnerFormationEnrollmentService learnerFormationEnrollmentService;
    private final LearnerFormationSessionService learnerFormationSessionService;
    private final JwtReader jwtReader;

    public PublicFormationController(LearnerFormationService learnerFormationService,
                                     LearnerFormationEnrollmentService learnerFormationEnrollmentService,
                                     LearnerFormationSessionService learnerFormationSessionService,
                                     JwtReader jwtReader) {
        this.learnerFormationService = learnerFormationService;
        this.learnerFormationEnrollmentService = learnerFormationEnrollmentService;
        this.learnerFormationSessionService = learnerFormationSessionService;
        this.jwtReader = jwtReader;
    }

    @GetMapping
    public ResponseEntity<List<FormationDetailsDTO>> getAllFormations() {
        return ResponseEntity.ok(learnerFormationService.getAllAvailableFormations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormationDetailsDTO> getFormationById(@PathVariable Long id) {
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
    public ResponseEntity<List<MyEnrolledFormationDTO>> getMyEnrollments(
            @RequestHeader("Authorization") String authorization
    ) {
        Long userId = jwtReader.extractUserId(authorization);
        return ResponseEntity.ok(
                learnerFormationEnrollmentService.getMyEnrolledFormations(userId)
        );
    }

    @GetMapping("/{id}/sessions")
    public ResponseEntity<List<FormationSessionDTO>> getFormationSessions(@PathVariable Long id) {
        return ResponseEntity.ok(
                learnerFormationSessionService.getSessionsByFormation(id)
        );
    }
}