package com.esprit.microservice.resourcemanagement.config;

import com.esprit.microservice.resourcemanagement.security.JwtAuthEntryPoint;
import com.esprit.microservice.resourcemanagement.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Security configuration for the ResourceManagement microservice.
 *
 * Role matrix:
 *  - Public (no auth):   GET /api/resources, GET /api/resources/{id},
 *                        POST /api/resources/check-availability, Swagger
 *  - Any authenticated:  GET /api/reservations/**, GET /api/resources/{id}/availability
 *  - ADMIN or INSTRUCTOR: POST /api/reservations,
 *                         PUT  /api/reservations/{id}/cancel,
 *                         POST /api/resources/{id}/availability
 *  - ADMIN only:         POST /api/resources, PUT /api/resources/{id},
 *                        DELETE /api/resources/{id},
 *                        PUT  /api/reservations/{id}/confirm
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex ->
                    ex.authenticationEntryPoint(jwtAuthEntryPoint))
            .authorizeHttpRequests(auth -> auth
                    // ── CORS preflight ──────────────────────────────────
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers("/actuator/**").permitAll()

                    // ── Swagger / OpenAPI ───────────────────────────────
                    .requestMatchers("/swagger-ui/**", "/swagger-ui.html",
                                     "/v3/api-docs/**", "/api-docs/**").permitAll()

                    // ── Public resource reads ───────────────────────────
                    .requestMatchers(HttpMethod.GET,  "/api/resources").permitAll()
                    .requestMatchers(HttpMethod.GET,  "/api/resources/{id}").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/resources/check-availability").permitAll()

                    // ── Admin-only resource writes ──────────────────────
                    .requestMatchers(HttpMethod.POST,   "/api/resources").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT,    "/api/resources/{id}").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/resources/{id}").hasRole("ADMIN")

                    // ── Availability windows ────────────────────────────
                    .requestMatchers(HttpMethod.POST, "/api/resources/{id}/availability")
                            .hasAnyRole("ADMIN", "INSTRUCTOR")
                    .requestMatchers(HttpMethod.GET,  "/api/resources/{id}/availability")
                            .authenticated()

                    // ── Reservations ────────────────────────────────────
                    .requestMatchers(HttpMethod.POST, "/api/reservations")
                            .hasAnyRole("ADMIN", "INSTRUCTOR")
                    .requestMatchers(HttpMethod.PUT,  "/api/reservations/{id}/confirm")
                            .hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT,  "/api/reservations/{id}/cancel")
                            .hasAnyRole("ADMIN", "INSTRUCTOR")
                    .requestMatchers(HttpMethod.GET,  "/api/reservations/**").authenticated()

                    // ── Everything else requires authentication ──────────
                    .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-User-Id"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
