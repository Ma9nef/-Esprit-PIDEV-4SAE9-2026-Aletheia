package com.esprit.microservice.events.client;

import com.esprit.microservice.events.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "aletheia-platform", path = "/api/users")
public interface UserServiceClient {

    /**
     * Récupérer un utilisateur par son ID
     */
    @GetMapping("/{id}")
    UserDTO getUserById(@PathVariable("id") Long id,
                        @RequestHeader("Authorization") String token);

    /**
     * Récupérer un utilisateur par son email
     */
    @GetMapping("/email/{email}")
    UserDTO getUserByEmail(@PathVariable("email") String email,
                           @RequestHeader("Authorization") String token);

    /**
     * Vérifier si un utilisateur existe par son ID
     */
    @GetMapping("/{id}/exists")
    Boolean checkUserExists(@PathVariable("id") Long id,
                            @RequestHeader("Authorization") String token);

    /**
     * Vérifier si un utilisateur existe par son email
     */
    @GetMapping("/email/{email}/exists")
    Boolean checkUserExistsByEmail(@PathVariable("email") String email,
                                   @RequestHeader("Authorization") String token);

    /**
     * Récupérer tous les utilisateurs (si besoin)
     */
    @GetMapping
    List<UserDTO> getAllUsers(@RequestHeader("Authorization") String token);
}