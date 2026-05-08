package com.esprit.microservice.courses.RestController.formations;


import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.service.instructor.formations.InstructorFormationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor/formations")
public class InstructorFormationController {

    private final InstructorFormationService instructorFormationService;

    public InstructorFormationController(InstructorFormationService instructorFormationService) {
        this.instructorFormationService = instructorFormationService;
    }

    @PostMapping
    public ResponseEntity<Formation> createFormation(
            @RequestBody Formation formation,
            @RequestParam Long instructorId
    ) {
        return ResponseEntity.ok(instructorFormationService.createFormation(formation, instructorId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Formation>> getMyFormations(@RequestParam Long instructorId) {
        return ResponseEntity.ok(instructorFormationService.getFormationsByInstructor(instructorId));
    }

    @GetMapping("/{formationId}")
    public ResponseEntity<Formation> getFormationByIdForInstructor(
            @PathVariable Long formationId,
            @RequestParam Long instructorId
    ) {
        return ResponseEntity.ok(
                instructorFormationService.getFormationByIdForInstructor(formationId, instructorId)
        );
    }

    @PutMapping("/{formationId}")
    public ResponseEntity<Formation> updateFormation(
            @PathVariable Long formationId,
            @RequestParam Long instructorId,
            @RequestBody Formation formation
    ) {
        return ResponseEntity.ok(
                instructorFormationService.updateFormation(formationId, instructorId, formation)
        );
    }
}