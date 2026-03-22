package com.esprit.microservice.courses.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;

@Component
public class JwtReader {

    private final Key key;

    public JwtReader(@Value("${app.jwt.secret}") String secret) {
        // Initialize the key once in the constructor
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        System.out.println("COURSE jwt.secret SHA-256 = " + sha256Hex(secret));
    }
        System.out.println("COURSE jwt.secret SHA-256 = " + sha256Hex(secret));   }

    /**
     * Helper method to extract token and parse claims to avoid code duplication
     */
    private Claims getAllClaims(String bearerOrToken) {
        if (bearerOrToken == null) return null;

        String token = bearerOrToken.startsWith("Bearer ")
    public Long extractUserId(String bearerOrToken) {
        String token = bearerOrToken != null && bearerOrToken.startsWith("Bearer ")
                ? bearerOrToken.substring(7)
                : bearerOrToken;

        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.err.println("JWT Parsing Error: " + e.getMessage());
            return null;
        }
    }
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

    public Long extractUserId(String bearerOrToken) {
        Claims claims = getAllClaims(bearerOrToken);
        if (claims == null) return null;

        // Try 'id' then 'userId'
        Object raw = claims.get("id");
        System.out.println("JWT raw id = " + raw + " | type = " + (raw == null ? "null" : raw.getClass().getName()));

        if (raw == null) raw = claims.get("userId");

        System.out.println("JWT raw id = " + raw + " | type = " + (raw == null ? "null" : raw.getClass().getName()));

        if (raw instanceof Number n) {
            return n.longValue();
            Long v = n.longValue();
            System.out.println("JWT extracted userId = " + v);
            return v;
        }

        if (raw instanceof String s && s.matches("\\d+")) {
            return Long.parseLong(s);
            Long v = Long.parseLong(s);
            System.out.println("JWT extracted userId = " + v);
            return v;
        }

        // Fallback to subject if numeric
        String sub = claims.getSubject();
        if (sub != null && sub.matches("\\d+")) {
            return Long.parseLong(sub);
        }
        System.out.println("JWT subject = " + sub);
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
        // Note: Adapts to your specific claim name (e.g., "role", "roles", "authorities")
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

    private static String sha256Hex(String s) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(s.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    public String extractName(String bearerOrToken) {
        String token = bearerOrToken != null && bearerOrToken.startsWith("Bearer ")
                ? bearerOrToken.substring(7)
                : bearerOrToken;

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("name", String.class); // adapte le claim
    }
    public String extractRole(String bearerOrToken) {
        String token = bearerOrToken != null && bearerOrToken.startsWith("Bearer ")
                ? bearerOrToken.substring(7)
                : bearerOrToken;

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        // ⚠️ Adapte le nom EXACT du claim :
        // "role" ou "roles" ou "authorities"
        return claims.get("role", String.class);
    }
    public void debugClaims(String bearerOrToken) {
        String token = bearerOrToken != null && bearerOrToken.startsWith("Bearer ")
                ? bearerOrToken.substring(7)
                : bearerOrToken;

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        System.out.println("JWT CLAIMS = " + claims);
        System.out.println("JWT SUBJECT = " + claims.getSubject());
    }
}