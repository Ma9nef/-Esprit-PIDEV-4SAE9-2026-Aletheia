package tn.platform.user.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthResponse {

    private String token;
    private Long userId;
    private String email;
    private String role;
}
