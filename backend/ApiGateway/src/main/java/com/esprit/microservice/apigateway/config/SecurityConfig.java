package com.esprit.microservice.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfiguration;

import javax.crypto.spec.SecretKeySpec;
import java.util.Arrays;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    // La clé secrète doit être la même que dans user-microservice
    private final String jwtSecret = "CHANGE_ME_CHANGE_ME_CHANGE_ME_123456";

    @Bean
    public ReactiveJwtDecoder reactiveJwtDecoder() {
        byte[] secretBytes = jwtSecret.getBytes();
        SecretKeySpec secretKey = new SecretKeySpec(secretBytes, "HmacSHA256");
        return NimbusReactiveJwtDecoder.withSecretKey(secretKey).build();
    }

    /*@Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        // Endpoints publics
                        .pathMatchers("/api/auth/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/users/login").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/users/forgot-password").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/users/reset-password").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/users/verify/**").permitAll()

                        // WebSocket endpoints - PERMIT ALL POUR TEST
                        .pathMatchers("/room/**").permitAll()
                        .pathMatchers("/room/*").permitAll()
                        .pathMatchers("/ws/**").permitAll()
                        .pathMatchers("/ws/*").permitAll()

                        // Swagger/OpenAPI
                        .pathMatchers("/v3/api-docs/**").permitAll()
                        .pathMatchers("/swagger-ui/**").permitAll()
                        .pathMatchers("/swagger-ui.html").permitAll()

                        // Actuator
                        .pathMatchers("/actuator/health/**").permitAll()
                        .pathMatchers("/actuator/info").permitAll()

                        // CORS preflight
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Toutes les autres requêtes doivent être authentifiées
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> {})
                )
                .build();
    }

*/
    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeExchange(exchanges -> exchanges
                        .anyExchange().permitAll()  // TOUT PERMETTRE POUR TEST
                )
                // .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}))  // COMMENTÉ POUR TEST
                .build();
    }



    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "X-Requested-With",
                "Cache-Control",
                "Upgrade",
                "Connection",
                "Sec-WebSocket-Key",
                "Sec-WebSocket-Version",
                "Sec-WebSocket-Extensions",
                "Sec-WebSocket-Protocol"
        ));
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Upgrade",
                "Connection"
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        source.registerCorsConfiguration("/room/**", configuration);
        source.registerCorsConfiguration("/room/*", configuration);

        return source;
    }
}