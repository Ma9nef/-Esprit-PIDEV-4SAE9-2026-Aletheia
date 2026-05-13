package com.esprit.microservice.resourcemanagement.controller;

import com.esprit.microservice.resourcemanagement.dto.request.AdjustScoreRequest;
import com.esprit.microservice.resourcemanagement.dto.response.InstructorProfileResponse;
import com.esprit.microservice.resourcemanagement.service.InstructorProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class InstructorProfileController {

    private final InstructorProfileService instructorProfileService;

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','ADMIN')")
    public ResponseEntity<InstructorProfileResponse> getMyProfile() {
        return ResponseEntity.ok(instructorProfileService.getProfile(currentUser()));
    }

    @GetMapping("/{instructorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InstructorProfileResponse> getProfile(
            @PathVariable String instructorId) {
        return ResponseEntity.ok(instructorProfileService.getProfile(instructorId));
    }

    @GetMapping("/leaderboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<InstructorProfileResponse>> leaderboard() {
        return ResponseEntity.ok(instructorProfileService.leaderboard());
    }

    @PatchMapping("/{instructorId}/score")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InstructorProfileResponse> adjustScore(
            @PathVariable String instructorId,
            @RequestBody AdjustScoreRequest req) {
        return ResponseEntity.ok(instructorProfileService.manualAdjust(instructorId, req.getDelta()));
    }

    private String currentUser() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
