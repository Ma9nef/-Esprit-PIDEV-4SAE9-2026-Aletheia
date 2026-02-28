package tn.platform.user.auth.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.platform.user.auth.dto.AuthResponse;
import tn.platform.user.auth.dto.CreateInstructorRequest;
import tn.platform.user.auth.service.AuthService;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminUserController {

    private final AuthService authService;

    @PostMapping("/instructor")
    public ResponseEntity<AuthResponse> createInstructor(
            @RequestBody CreateInstructorRequest request) {

        return ResponseEntity.ok(authService.registerInstructor(request));
    }
}