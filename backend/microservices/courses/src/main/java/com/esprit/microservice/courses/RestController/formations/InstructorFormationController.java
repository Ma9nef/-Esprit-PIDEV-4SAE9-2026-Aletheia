package com.esprit.microservice.courses.RestController.formations;

import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.security.JwtReader;
import com.esprit.microservice.courses.service.instructor.formations.InstructorFormationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor/formations")
public class InstructorFormationController {

    private final InstructorFormationService instructorFormationService;
    private final JwtReader jwtReader;

    public InstructorFormationController(InstructorFormationService instructorFormationService,
                                         JwtReader jwtReader) {
        this.instructorFormationService = instructorFormationService;
        this.jwtReader = jwtReader;
    }

    @PostMapping
    public ResponseEntity<Formation> createFormation(
            @RequestBody Formation formation,
            @RequestHeader("Authorization") String authorization
    ) {
        Long instructorId = jwtReader.extractUserId(authorization);

        return ResponseEntity.ok(
                instructorFormationService.createFormation(formation, instructorId)
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<Formation>> getMyFormations(
            @RequestHeader("Authorization") String authorization
    ) {
        Long instructorId = jwtReader.extractUserId(authorization);

        return ResponseEntity.ok(
                instructorFormationService.getFormationsByInstructor(instructorId)
        );
    }

    @GetMapping("/{formationId}")
    public ResponseEntity<Formation> getFormationByIdForInstructor(
            @PathVariable Long formationId,
            @RequestHeader("Authorization") String authorization
    ) {
        Long instructorId = jwtReader.extractUserId(authorization);

        return ResponseEntity.ok(
                instructorFormationService.getFormationByIdForInstructor(formationId, instructorId)
        );
    }

    @PutMapping("/{formationId}")
    public ResponseEntity<Formation> updateFormation(
            @PathVariable Long formationId,
            @RequestBody Formation formation,
            @RequestHeader("Authorization") String authorization
    ) {
        Long instructorId = jwtReader.extractUserId(authorization);

        return ResponseEntity.ok(
                instructorFormationService.updateFormation(formationId, instructorId, formation)
        );
    }
}