package com.esprit.microservice.courses.RestController.formations;

import com.esprit.microservice.courses.entity.formations.Formation;
import com.esprit.microservice.courses.service.admin.formation.AdminFormationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/formations")
public class AdminFormationController {

    private final AdminFormationService adminFormationService;

    public AdminFormationController(AdminFormationService adminFormationService) {
        this.adminFormationService = adminFormationService;
    }

    @GetMapping
    public ResponseEntity<List<Formation>> getAllFormations() {
        return ResponseEntity.ok(adminFormationService.getAllFormations());
    }

    @GetMapping("/archived")
    public ResponseEntity<List<Formation>> getArchivedFormations() {
        return ResponseEntity.ok(adminFormationService.getArchivedFormations());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Formation>> getActiveFormations() {
        return ResponseEntity.ok(adminFormationService.getActiveFormations());
    }

    @PutMapping("/{formationId}/archive")
    public ResponseEntity<Formation> archiveFormation(@PathVariable Long formationId) {
        return ResponseEntity.ok(adminFormationService.archiveFormation(formationId));
    }

    @PutMapping("/{formationId}/unarchive")
    public ResponseEntity<Formation> unarchiveFormation(@PathVariable Long formationId) {
        return ResponseEntity.ok(adminFormationService.unarchiveFormation(formationId));
    }
}