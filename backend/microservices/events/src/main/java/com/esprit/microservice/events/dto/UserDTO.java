package com.esprit.microservice.events.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String nom;
    private String prenom;
    private String role;
    private Boolean actif;
    private LocalDateTime dateCreation;

    // Méthode utilitaire pour obtenir le nom complet
    public String getFullName() {
        return nom + " " + prenom;
    }
}