package com.esprit.microservice.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                // Route pour l'authentification (auth)
                .route("user-auth", r -> r
                        .path("/api/auth/**")
                        .filters(f -> f.tokenRelay())
                        .uri("lb://aletheia-platform"))

                .route("user-service", r -> r
                        .path("/api/users/**")
                        .filters(f -> f.tokenRelay())
                        .uri("lb://aletheia-platform"))

                .route("test-service", r -> r
                        .path("/api/test2/**")
                        .filters(f -> f.tokenRelay())
                        .uri("lb://event-microservice"))

                .route("courses-service", r -> r
                        .path("/api/courses/**")
                        .filters(f -> f.tokenRelay())
                        .uri("lb://courses"))

                .route("library-service", r -> r
                        .path("/api/library/**")
                        .filters(f -> f.tokenRelay())
                        .uri("lb://library-service"))

                .route("products-service", r -> r
                        .path("/api/products/**")
                        .filters(f -> f.tokenRelay())
                        .uri("lb://library-service"))

                .route("event-service", r -> r
                        .path("/api/events/**")
                        .filters(f -> f.tokenRelay())
                        .uri("lb://event-microservice"))

                // CORRECTION: Route WebSocket simplifiée
                .route("event-websocket", r -> r
                        .path("/room/**")
                        .filters(f -> f
                                // Ne pas modifier les headers pour WebSocket
                                .setResponseHeader("Connection", "Upgrade")
                                .setResponseHeader("Upgrade", "websocket"))
                        .uri("lb://event-microservice"))  // URI normale, pas de ws://
                .build();
    }
}