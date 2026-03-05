package com.esprit.microservice.library.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) {
        http
                .csrf(csrf -> csrf.disable())  // Disable CSRF for REST API (appropriate for stateless APIs)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()          // Allow all requests without authentication
                )
                .httpBasic(Customizer.withDefaults()); // Optional: basic auth (can be removed)

        return http.build();
    }
}