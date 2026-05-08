package com.esprit.microservice.events.config;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.*;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import com.esprit.microservice.events.security.JwtService;
import io.jsonwebtoken.Claims;

import java.util.ArrayList;
import java.util.Map;

@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtService jwtService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) throws Exception {

        String token = null;

        // Extract token from URL parameters
        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getServletRequest();
            token = httpRequest.getParameter("token");

            // If not in URL, try Authorization header
            if (token == null || token.isEmpty()) {
                String authHeader = httpRequest.getHeader("Authorization");
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    token = authHeader.substring(7);
                }
            }
        }

        if (token != null && !token.isEmpty()) {
            try {
                if (jwtService.validateToken(token)) {
                    String email = jwtService.getEmailFromToken(token);
                    Long userId = jwtService.getUserIdFromToken(token);

                    // Create UserDetails object
                    UserDetails userDetails = User.builder()
                            .username(email)
                            .password("")
                            .authorities(new ArrayList<>())
                            .build();

                    // Store in WebSocket session attributes
                    attributes.put("user", userDetails);
                    attributes.put("userId", userId);
                    attributes.put("email", email);

                    System.out.println("✅ WebSocket authentifié: " + email);
                    return true;
                }
            } catch (Exception e) {
                System.err.println("❌ Erreur validation token: " + e.getMessage());
            }
        }

        System.out.println("❌ WebSocket non authentifié - pas de token valide");
        return false; // Reject connection if no valid token
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {
        // Nothing to do here
    }
}