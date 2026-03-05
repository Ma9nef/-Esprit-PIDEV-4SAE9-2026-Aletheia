package tn.platform.user.user.dto;

import lombok.Builder;
import lombok.Data;
import tn.platform.user.user.entity.Role;
@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String nom;
    private String prenom;
    private Role role;
    private String phone;
    private String photoUrl;
    private String bio;
}
