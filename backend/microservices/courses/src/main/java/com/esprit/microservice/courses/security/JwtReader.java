package com.esprit.microservice.courses.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;

@Component
public class JwtReader {

    private static final Logger log = LoggerFactory.getLogger(JwtReader.class);

    private final Key key;

    public JwtReader(@Value("${app.jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Helper method to extract token and parse claims to avoid code duplication.
     */
    private Claims getAllClaims(String bearerOrToken) {
        if (bearerOrToken == null) return null;

        String token = bearerOrToken.startsWith("Bearer ")
                ? bearerOrToken.substring(7)
                : bearerOrToken;

        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            log.warn("JWT parse error: {}", e.getMessage());
            return null;
        }
    }

    public Long extractUserId(String bearerOrToken) {
        Claims claims = getAllClaims(bearerOrToken);
        if (claims == null) return null;

        // Try 'id' then 'userId'
        Object raw = claims.get("id");
        if (raw == null) raw = claims.get("userId");

        if (raw instanceof Number n) {
            Long v = n.longValue();
            return v;
        }

        if (raw instanceof String s && s.matches("\\d+")) {
            Long v = Long.parseLong(s);
            return v;
        }

        // Fallback to subject if numeric
        String sub = claims.getSubject();
        if (sub != null && sub.matches("\\d+")) return Long.parseLong(sub);

        return null;
    }

    public String extractName(String bearerOrToken) {
        Claims claims = getAllClaims(bearerOrToken);
        return (claims != null) ? claims.get("name", String.class) : null;
    }

    public String extractFullName(String bearerOrToken) {
        Claims claims = getAllClaims(bearerOrToken);
        if (claims == null) return "Learner";

        try {
            String nom = claims.get("nom", String.class);
            String prenom = claims.get("prenom", String.class);

            if (nom == null && prenom == null) {
                return "Learner";
            }

            StringBuilder fullName = new StringBuilder();
            if (prenom != null) fullName.append(prenom).append(" ");
            if (nom != null) fullName.append(nom);

            return fullName.toString().trim();
        } catch (Exception e) {
            return "Learner";
        }
    }

    public String extractRole(String bearerOrToken) {
        Claims claims = getAllClaims(bearerOrToken);
        return (claims != null) ? claims.get("role", String.class) : null;
    }

    public void debugClaims(String bearerOrToken) {
        Claims claims = getAllClaims(bearerOrToken);
        if (claims != null) {
            System.out.println("JWT CLAIMS = " + claims);
            System.out.println("JWT SUBJECT = " + claims.getSubject());
        } else {
            System.out.println("JWT CLAIMS = NULL (Invalid Token)");
        }
    }

}