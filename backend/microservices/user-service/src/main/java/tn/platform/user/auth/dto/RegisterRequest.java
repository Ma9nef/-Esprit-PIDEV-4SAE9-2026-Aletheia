package tn.platform.user.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank
    private String nom;

    private String prenom;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}

