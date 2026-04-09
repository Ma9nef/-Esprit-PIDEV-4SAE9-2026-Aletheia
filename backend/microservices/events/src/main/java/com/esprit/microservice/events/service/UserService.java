package com.esprit.microservice.events.service;

import com.esprit.microservice.events.client.UserServiceClient;
import com.esprit.microservice.events.dto.UserDTO;
import com.esprit.microservice.events.exception.UserNotFoundException;
import com.esprit.microservice.events.exception.UserServiceException;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserServiceClient userServiceClient;

    /**
     * Récupère le token JWT actuel depuis le contexte de sécurité
     */
    private String getCurrentToken() {
        try {
            Object credentials = SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getCredentials();
            return credentials != null ? "Bearer " + credentials.toString() : null;
        } catch (Exception e) {
            log.warn("Could not retrieve token from security context: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Récupère un utilisateur par son ID
     */
    public UserDTO getUserById(Long userId) {
        String token = getCurrentToken();
        if (token == null) {
            throw new UserServiceException("No authentication token found");
        }

        try {
            log.debug("Fetching user with id: {}", userId);
            return userServiceClient.getUserById(userId, token);
        } catch (FeignException.NotFound e) {
            log.error("User not found with id: {}", userId);
            throw new UserNotFoundException("User not found with id: " + userId);
        } catch (FeignException.Unauthorized e) {
            log.error("Unauthorized access to user service");
            throw new UserServiceException("Unauthorized access to user service");
        } catch (FeignException e) {
            log.error("Error fetching user with id {}: {}", userId, e.getMessage());
            throw new UserServiceException("Error communicating with user service");
        }
    }

    /**
     * Récupère un utilisateur par son email
     */
    public UserDTO getUserByEmail(String email) {
        String token = getCurrentToken();
        if (token == null) {
            throw new UserServiceException("No authentication token found");
        }

        try {
            log.debug("Fetching user with email: {}", email);
            return userServiceClient.getUserByEmail(email, token);
        } catch (FeignException.NotFound e) {
            log.error("User not found with email: {}", email);
            throw new UserNotFoundException("User not found with email: " + email);
        } catch (FeignException e) {
            log.error("Error fetching user with email {}: {}", email, e.getMessage());
            throw new UserServiceException("Error communicating with user service");
        }
    }

    /**
     * Vérifie si un utilisateur existe par son ID
     */
    public boolean checkUserExists(Long userId) {
        String token = getCurrentToken();
        if (token == null) {
            return false;
        }

        try {
            return userServiceClient.checkUserExists(userId, token);
        } catch (FeignException e) {
            log.error("Error checking user existence for id {}: {}", userId, e.getMessage());
            return false;
        }
    }

    /**
     * Vérifie si un utilisateur existe par son email
     */
    public boolean checkUserExistsByEmail(String email) {
        String token = getCurrentToken();
        if (token == null) {
            return false;
        }

        try {
            return userServiceClient.checkUserExistsByEmail(email, token);
        } catch (FeignException e) {
            log.error("Error checking user existence for email {}: {}", email, e.getMessage());
            return false;
        }
    }

    /**
     * Récupère tous les utilisateurs
     */
    public List<UserDTO> getAllUsers() {
        String token = getCurrentToken();
        if (token == null) {
            throw new UserServiceException("No authentication token found");
        }

        try {
            return userServiceClient.getAllUsers(token);
        } catch (FeignException e) {
            log.error("Error fetching all users: {}", e.getMessage());
            throw new UserServiceException("Error communicating with user service");
        }
    }

    /**
     * Valide qu'un organisateur existe (par email)
     */
    public boolean validateOrganizer(String organizerEmail) {
        try {
            UserDTO user = getUserByEmail(organizerEmail);
            return user != null && user.getActif();
        } catch (UserNotFoundException e) {
            log.warn("Organizer not found: {}", organizerEmail);
            return false;
        }
    }
}