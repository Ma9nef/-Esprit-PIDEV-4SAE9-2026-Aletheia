package com.esprit.microservice.events.config;

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

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

 /*
@Bean
   public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
       http
               .csrf(csrf -> csrf.disable())
               .cors(cors -> cors.configurationSource(corsConfigurationSource()))
               .sessionManagement(session ->
                       session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
               )
               .authorizeHttpRequests(auth -> auth
                       // Permettre les requêtes OPTIONS pour CORS preflight
                       .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                       // Endpoints publics
                       .requestMatchers("/api/auth/**").permitAll()
                       // WebSocket endpoints - VERY IMPORTANT
                       .requestMatchers("/room/**").permitAll()
                       .requestMatchers("/room/*").permitAll()
                       .requestMatchers("/ws/**").permitAll()
                       .requestMatchers("/ws/*").permitAll()
                       .requestMatchers("/socket.io/**").permitAll() // For SockJS fallback
                       // Endpoints protégés
                       .requestMatchers("/api/events/**").authenticated()
                       .requestMatchers("/api/allocations/**").authenticated()
                       .anyRequest().authenticated()
               )
               .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

       return http.build();
   }

 */
 @Bean
 public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
     http
             .csrf(csrf -> csrf.disable())
             .cors(cors -> cors.configurationSource(corsConfigurationSource()))
             .authorizeHttpRequests(auth -> auth
                     .anyRequest().permitAll()  // TOUT PERMETTRE POUR TEST
             )
             // .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)  // COMMENTÉ
             .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

     return http.build();
 }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Autoriser votre frontend Angular
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));

        // Autoriser toutes les méthodes HTTP nécessaires
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // Autoriser tous les headers
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "X-Requested-With",
                "Cache-Control"
        ));

        // Exposer les headers
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Disposition"
        ));

        // Autoriser les credentials
        configuration.setAllowCredentials(true);

        // Temps de cache pour les preflight requests
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}