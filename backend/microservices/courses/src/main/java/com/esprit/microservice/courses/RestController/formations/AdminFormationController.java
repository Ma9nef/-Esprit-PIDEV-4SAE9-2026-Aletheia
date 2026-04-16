package com.esprit.microservice.courses.RestController.formations;

import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.security.JwtReader;
import com.esprit.microservice.courses.service.admin.formation.AdminFormationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/formations")
public class AdminFormationController {

    private final AdminFormationService adminFormationService;
    private final JwtReader jwtReader;

    public AdminFormationController(AdminFormationService adminFormationService,
                                    JwtReader jwtReader) {
        this.adminFormationService = adminFormationService;
        this.jwtReader = jwtReader;
    }

    @GetMapping
    public ResponseEntity<List<Formation>> getAllFormations(
            @RequestHeader("Authorization") String authorization
    ) {
        jwtReader.extractUserId(authorization);

        return ResponseEntity.ok(
                adminFormationService.getAllFormations()
        );
    }

    @GetMapping("/archived")
    public ResponseEntity<List<Formation>> getArchivedFormations(
            @RequestHeader("Authorization") String authorization
    ) {
        jwtReader.extractUserId(authorization);

        return ResponseEntity.ok(
                adminFormationService.getArchivedFormations()
        );
    }

    @GetMapping("/active")
    public ResponseEntity<List<Formation>> getActiveFormations(
            @RequestHeader("Authorization") String authorization
    ) {
        jwtReader.extractUserId(authorization);

        return ResponseEntity.ok(
                adminFormationService.getActiveFormations()
        );
    }

    @PutMapping("/{formationId}/archive")
    public ResponseEntity<Formation> archiveFormation(
            @PathVariable Long formationId,
            @RequestHeader("Authorization") String authorization
    ) {
        jwtReader.extractUserId(authorization);

        return ResponseEntity.ok(
                adminFormationService.archiveFormation(formationId)
        );
    }

    @PutMapping("/{formationId}/unarchive")
    public ResponseEntity<Formation> unarchiveFormation(
            @PathVariable Long formationId,
            @RequestHeader("Authorization") String authorization
    ) {
        jwtReader.extractUserId(authorization);

        return ResponseEntity.ok(
                adminFormationService.unarchiveFormation(formationId)
        );
    }
}