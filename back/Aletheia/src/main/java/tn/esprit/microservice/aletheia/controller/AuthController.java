package tn.esprit.microservice.aletheia.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.microservice.aletheia.entity.Utilisateur;
import tn.esprit.microservice.aletheia.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody Utilisateur user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody Utilisateur request) {
        return authService.login(request.getEmail(), request.getPassword());
    }
}
