package com.esprit.microservice.courses.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDTO {
    private Long userId;
    private String email;
    private String role;
}