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
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        System.out.println("COURSE jwt.secret SHA-256 = " + sha256Hex(secret));   }

    public Long extractUserId(String bearerOrToken) {
        String token = bearerOrToken != null && bearerOrToken.startsWith("Bearer ")
                ? bearerOrToken.substring(7)
                : bearerOrToken;

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();


        return claims.get("id", Long.class);
    }
    private static String sha256Hex(String s) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(s.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String extractFullName(String authHeader) {
        // 1. On nettoie le token pour enlever "Bearer " si présent
        String token = (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7)
                : authHeader;

        try {
            // 2. On décode le JWT en utilisant la clé initialisée dans le constructeur
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(this.key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // 3. Extraction des claims "nom" et "prenom"
            // Note : assurez-vous que le microservice User utilise exactement ces noms là
            String nom = claims.get("nom", String.class);
            String prenom = claims.get("prenom", String.class);

            // 4. Construction du nom complet avec gestion des valeurs nulles
            if (nom == null && prenom == null) {
                return "Learner";
            }

            StringBuilder fullName = new StringBuilder();
            if (prenom != null) fullName.append(prenom).append(" ");
            if (nom != null) fullName.append(nom);

            return fullName.toString().trim();

        } catch (Exception e) {
            // En cas d'erreur de parsing (token expiré ou invalide)
            System.err.println("JWT Extraction Error: " + e.getMessage());
            return "Learner";
        }
    }
}