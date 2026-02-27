package com.esprit.microservice.courses.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtReader jwtReader;

    public JwtAuthFilter(JwtReader jwtReader) {
        this.jwtReader = jwtReader;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // Pas de token => on laisse passer (les routes publiques fonctionneront)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            Long userId = jwtReader.extractUserId(authHeader);
            String name = jwtReader.extractName(authHeader); // optionnel
            String role = jwtReader.extractRole(authHeader); // "INSTRUCTOR" par ex.

            var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

            // principal: tu peux mettre userId, email, name... ici userId
            var auth = new UsernamePasswordAuthenticationToken(userId, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(auth);

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            // Token invalide => 401
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}