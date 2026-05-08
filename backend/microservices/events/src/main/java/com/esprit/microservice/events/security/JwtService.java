package com.esprit.microservice.events.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    private Key key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // Remplacer getEmailFromToken par extractUsername pour uniformiser
    public String extractUsername(String token) {
        try {
            return extractClaims(token).getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    // Garder getEmailFromToken pour compatibilité
    public String getEmailFromToken(String token) {
        return extractUsername(token);
    }

    public Long getUserIdFromToken(String token) {
        try {
            return extractClaims(token).get("id", Long.class);
        } catch (Exception e) {
            return null;
        }
    }

    public String getRoleFromToken(String token) {
        try {
            return extractClaims(token).get("role", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    // Remplacer validateToken par isTokenValid
    public boolean isTokenValid(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Garder validateToken pour compatibilité
    public boolean validateToken(String token) {
        return isTokenValid(token);
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}