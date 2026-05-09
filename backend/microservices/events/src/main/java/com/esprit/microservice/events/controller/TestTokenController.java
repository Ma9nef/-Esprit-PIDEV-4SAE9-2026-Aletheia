package com.esprit.microservice.events.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test2")
public class TestTokenController {

    // Constantes ajoutées
    private static final String KEY_MESSAGE = "message";
    private static final String KEY_STATUS = "status";
    private static final String VALUE_OK = "OK";

    @GetMapping("/public")
    public ResponseEntity<Map<String, String>> publicEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put(KEY_MESSAGE, "Ceci est un endpoint public");
        response.put(KEY_STATUS, VALUE_OK);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/secure")
    public ResponseEntity<Map<String, Object>> secureEndpoint(
            @AuthenticationPrincipal UserDetails userDetails) {

        Map<String, Object> response = new HashMap<>();
        response.put(KEY_MESSAGE, "Ceci est un endpoint sécurisé");
        response.put(KEY_STATUS, VALUE_OK);

        if (userDetails != null) {
            response.put("username", userDetails.getUsername());
            response.put("authorities", userDetails.getAuthorities());
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/token-info")
    public ResponseEntity<Map<String, Object>> getTokenInfo(
            @RequestHeader("Authorization") String authHeader) {

        Map<String, Object> response = new HashMap<>();
        response.put("header", authHeader);

        String token = authHeader.substring(7);
        response.put("token", token.substring(0, Math.min(20, token.length())) + "...");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/hello")
    public ResponseEntity<Map<String, String>> hello() {
        Map<String, String> response = new HashMap<>();
        response.put(KEY_MESSAGE, "Le service fonctionne!");
        response.put(KEY_STATUS, VALUE_OK);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ml-status")
    public ResponseEntity<Map<String, Object>> mlStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("ml_service_url", "http://localhost:5000");
        response.put(KEY_STATUS, "configured");
        return ResponseEntity.ok(response);
    }
}