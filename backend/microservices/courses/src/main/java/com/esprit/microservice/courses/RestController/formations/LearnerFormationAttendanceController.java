package com.esprit.microservice.courses.RestController.formations;

import com.esprit.microservice.courses.dto.training.FormationAttendanceSummaryDTO;
import com.esprit.microservice.courses.security.JwtReader;
import com.esprit.microservice.courses.service.publicApi.formations.LearnerFormationAttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/formations")
public class LearnerFormationAttendanceController {

    private final LearnerFormationAttendanceService learnerFormationAttendanceService;
    private final JwtReader jwtReader;

    public LearnerFormationAttendanceController(
            LearnerFormationAttendanceService learnerFormationAttendanceService,
            JwtReader jwtReader
    ) {
        this.learnerFormationAttendanceService = learnerFormationAttendanceService;
        this.jwtReader = jwtReader;
    }

    @GetMapping("/{id}/attendance/me")
    public ResponseEntity<FormationAttendanceSummaryDTO> getMyAttendance(
            @PathVariable("id") Long formationId,
            @RequestHeader("Authorization") String authorization
    ) {
        Long userId = jwtReader.extractUserId(authorization);

        FormationAttendanceSummaryDTO dto =
                learnerFormationAttendanceService.getMyAttendance(formationId, userId);

        return ResponseEntity.ok(dto);
    }
}