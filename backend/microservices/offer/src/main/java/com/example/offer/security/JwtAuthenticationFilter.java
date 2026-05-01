package com.example.offer.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain) throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String token = resolveToken(request);
        if (!StringUtils.hasText(token)) {
            if (request.getRequestURI() != null && request.getRequestURI().contains("/checkout-session")) {
                boolean hasAuthHdr = StringUtils.hasText(request.getHeader("Authorization"));
                boolean hasXAuth = StringUtils.hasText(request.getHeader("X-Auth-Token"));
                log.warn(
                        "checkout-session: no JWT resolved (anonymous). Authorization={}, X-Auth-Token={} — if absent here, headers are dropped before offer (proxy/gateway). If Authorization=present, Bearer prefix may be missing or malformed.",
                        hasAuthHdr ? "present" : "absent",
                        hasXAuth ? "present" : "absent");
            }
            chain.doFilter(request, response);
            return;
        }

        if (!jwtService.isTokenValid(token)) {
            log.warn("Invalid JWT on {}", request.getRequestURI());
            respondUnauthorized(response,
                    "Invalid or expired JWT. Sign out, sign in again, and ensure JWT_SECRET is identical on user-service and offer.");
            return;
        }

        String email = jwtService.extractEmail(token);
        String role  = jwtService.extractRole(token);

        if (role == null || role.isBlank()) {
            log.warn("JWT missing role claim on {}", request.getRequestURI());
            respondUnauthorized(response,
                    "JWT has no role claim. Sign out and sign in again.");
            return;
        }

        String authority = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        List<SimpleGrantedAuthority> authorities =
                Collections.singletonList(new SimpleGrantedAuthority(authority));

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(email, null, authorities);
        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(auth);

        chain.doFilter(request, response);
    }

    /**
     * Authorization (Bearer), or raw JWT in X-Auth-Token (fallback if proxies strip standard header).
     */
    private static String resolveToken(HttpServletRequest request) {
        String bearer = extractBearerToken(request.getHeader("Authorization"));
        if (StringUtils.hasText(bearer)) {
            return bearer.trim();
        }
        String xAuthToken = request.getHeader("X-Auth-Token");
        if (StringUtils.hasText(xAuthToken)) {
            return xAuthToken.trim();
        }
        return extractBearerToken(request.getHeader("X-Authorization"));
    }

    private static String extractBearerToken(String header) {
        if (!StringUtils.hasText(header) || header.length() <= BEARER_PREFIX.length()) {
            return null;
        }
        if (!header.regionMatches(true, 0, BEARER_PREFIX, 0, BEARER_PREFIX.length())) {
            return null;
        }
        return header.substring(BEARER_PREFIX.length()).trim();
    }

    private static void respondUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        String safe = message.replace("\\", "\\\\").replace("\"", "\\\"");
        response.getWriter().write("{\"error\":\"Unauthorized\",\"message\":\"" + safe + "\"}");
    }
}
