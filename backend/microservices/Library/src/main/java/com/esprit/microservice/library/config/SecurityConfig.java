package com.esprit.microservice.library.config;

import com.esprit.microservice.library.security.JwtAuthEntryPoint;
import com.esprit.microservice.library.security.JwtAuthenticationFilter;
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
 * Security configuration for the Library microservice.
 *
 * Role matrix:
 *  - Public (no auth):    GET /api/products, GET /api/products/{id},
 *                         GET /api/products/low-stock, GET /api/files/**,
 *                         Swagger
 *  - ADMIN only:          POST/PUT/DELETE /api/products/**,
 *                         GET/POST /api/stock-movements/**
 *  - Any authenticated:   GET/POST/DELETE /api/cart/**,
 *                         POST /api/orders/checkout, GET /api/orders/**,
 *                         GET /api/receipts/**
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
            .headers(h -> h.frameOptions(f -> f.sameOrigin()))
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex ->
                    ex.authenticationEntryPoint(jwtAuthEntryPoint))
            .authorizeHttpRequests(auth -> auth
                    // ── CORS preflight ──────────────────────────────────
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    .requestMatchers("/actuator/**").permitAll()

                    // ── Public file downloads ───────────────────────────
                    .requestMatchers(HttpMethod.GET, "/api/files/**").permitAll()

                    // ── Public product catalog ──────────────────────────
                    .requestMatchers(HttpMethod.GET, "/api/products").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/products/{id}").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/products/low-stock").permitAll()

                    // ── Admin-only product management ───────────────────
                    .requestMatchers(HttpMethod.POST,   "/api/products/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT,    "/api/products/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                    // ── Admin-only stock management ─────────────────────
                    .requestMatchers("/api/stock-movements/**").hasRole("ADMIN")

                    // ── Authenticated: cart, orders, receipts ───────────
                    .requestMatchers("/api/cart/**").authenticated()
                    .requestMatchers("/api/orders/**").authenticated()
                    .requestMatchers("/api/receipts/**").authenticated()
                    .requestMatchers(HttpMethod.POST, "/api/files/**").hasRole("ADMIN")

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
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setExposedHeaders(List.of("Authorization", "Content-Disposition"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
