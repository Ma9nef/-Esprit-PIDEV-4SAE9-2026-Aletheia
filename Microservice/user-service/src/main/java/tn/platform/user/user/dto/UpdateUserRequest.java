package tn.platform.user.user.dto;

import lombok.Data;

@Data

public class UpdateUserRequest {
    private String nom;
    private String prenom;
    private String phone;
    private String photoUrl;
    private String bio;
}
