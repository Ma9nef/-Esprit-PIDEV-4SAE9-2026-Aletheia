package com.esprit.microservice.library.dto;

import lombok.Data;

/**
 * Minimal projection of a User received from the User microservice via Feign.
 */
@Data
public class UserDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}
