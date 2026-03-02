package tn.esprit.microservice.aletheia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.microservice.aletheia.entity.Utilisateur;

import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
}
