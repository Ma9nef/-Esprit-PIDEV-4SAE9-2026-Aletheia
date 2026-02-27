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

        Object raw = claims.get("id");
        System.out.println("JWT raw id = " + raw + " | type = " + (raw == null ? "null" : raw.getClass().getName()));

        if (raw == null) raw = claims.get("userId");

        if (raw instanceof Number n) {
            Long v = n.longValue();
            System.out.println("JWT extracted userId = " + v);
            return v;
        }
        if (raw instanceof String s && s.matches("\\d+")) {
            Long v = Long.parseLong(s);
            System.out.println("JWT extracted userId = " + v);
            return v;
        }

        String sub = claims.getSubject();
        System.out.println("JWT subject = " + sub);
        if (sub != null && sub.matches("\\d+")) return Long.parseLong(sub);

        return null;
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