package tn.platform.user.auth.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.platform.user.auth.dto.AuthResponse;
import tn.platform.user.auth.dto.CreateInstructorRequest;
import tn.platform.user.auth.service.AuthService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AuthService authService;

    // ✅ CREATE instructor
    @PostMapping("/instructor")
    public ResponseEntity<AuthResponse> createInstructor(
            @RequestBody CreateInstructorRequest request) {

        return ResponseEntity.ok(authService.registerInstructor(request));
    }
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

}