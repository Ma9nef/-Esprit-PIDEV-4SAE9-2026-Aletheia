package com.esprit.microservice.courses.RestController.formations;

import com.esprit.microservice.courses.entity.formations.FormationSession;
import com.esprit.microservice.courses.security.JwtReader;
import com.esprit.microservice.courses.service.instructor.formations.InstructorFormationSessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor/formations")
public class InstructorFormationSessionController {

    private final InstructorFormationSessionService instructorFormationSessionService;
    private final JwtReader jwtReader;

    public InstructorFormationSessionController(InstructorFormationSessionService instructorFormationSessionService,
                                                JwtReader jwtReader) {
        this.instructorFormationSessionService = instructorFormationSessionService;
        this.jwtReader = jwtReader;
    }

    @PostMapping("/{formationId}/sessions")
    public ResponseEntity<FormationSession> createSession(
            @PathVariable Long formationId,
            @RequestBody FormationSession session,
            @RequestHeader("Authorization") String authorization
    ) {
        Long instructorId = jwtReader.extractUserId(authorization);
        return ResponseEntity.ok(
                instructorFormationSessionService.createSession(formationId, instructorId, session)
        );
    }

    @GetMapping("/{formationId}/sessions")
    public ResponseEntity<List<FormationSession>> getSessionsByFormation(
            @PathVariable Long formationId,
            @RequestHeader("Authorization") String authorization
    ) {
        Long instructorId = jwtReader.extractUserId(authorization);
        return ResponseEntity.ok(
                instructorFormationSessionService.getSessionsByFormationForInstructor(formationId, instructorId)
        );
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<FormationSession> getSessionById(
            @PathVariable Long sessionId,
            @RequestHeader("Authorization") String authorization
    ) {
        Long instructorId = jwtReader.extractUserId(authorization);
        return ResponseEntity.ok(
                instructorFormationSessionService.getSessionByIdForInstructor(sessionId, instructorId)
        );
    }

    @PutMapping("/sessions/{sessionId}")
    public ResponseEntity<FormationSession> updateSession(
            @PathVariable Long sessionId,
            @RequestBody FormationSession session,
            @RequestHeader("Authorization") String authorization
    ) {
        Long instructorId = jwtReader.extractUserId(authorization);
        return ResponseEntity.ok(
                instructorFormationSessionService.updateSession(sessionId, instructorId, session)
        );
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<Void> deleteSession(
            @PathVariable Long sessionId,
            @RequestHeader("Authorization") String authorization
    ) {
        Long instructorId = jwtReader.extractUserId(authorization);
        instructorFormationSessionService.deleteSession(sessionId, instructorId);
        return ResponseEntity.noContent().build();
    }
}