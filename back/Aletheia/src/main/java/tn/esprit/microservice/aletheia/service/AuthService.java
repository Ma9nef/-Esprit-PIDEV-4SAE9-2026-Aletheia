package tn.esprit.microservice.aletheia.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tn.esprit.microservice.aletheia.entity.Role;
import tn.esprit.microservice.aletheia.entity.Utilisateur;
import tn.esprit.microservice.aletheia.repository.UtilisateurRepository;
import tn.esprit.microservice.aletheia.security.JwtService;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public String register(Utilisateur user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) {
            user.setRole(Role.ROLE_USER); // par défaut
        }
        repository.save(user);
        return "Utilisateur créé";
    }


    public String login(String email, String password) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        return jwtService.generateToken(email);
    }
}
