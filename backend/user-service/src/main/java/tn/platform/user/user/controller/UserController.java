package tn.platform.user.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.platform.user.user.dto.ChangePasswordRequest;
import tn.platform.user.user.dto.UpdateUserRequest;
import tn.platform.user.user.dto.UserResponse;
import tn.platform.user.user.service.UserService;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import java.io.IOException;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(
            @RequestBody UpdateUserRequest request) {

        return ResponseEntity.ok(userService.updateCurrentUser(request));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request) {

        userService.changePassword(request);
        return ResponseEntity.ok("Password updated");
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteMe() {

        userService.deleteCurrentUser();
        return ResponseEntity.ok("Account deleted");
    }

    @GetMapping("/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            Pageable pageable) {

        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @PostMapping("/me/photo")
    public ResponseEntity<UserResponse> uploadPhoto(
            @RequestParam("file") MultipartFile file) throws IOException {

        return ResponseEntity.ok(userService.uploadPhoto(file));
    }


}
