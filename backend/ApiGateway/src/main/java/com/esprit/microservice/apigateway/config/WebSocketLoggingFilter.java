package com.esprit.microservice.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.server.WebFilter;
import reactor.core.publisher.Mono;

@Configuration
public class WebSocketLoggingFilter {

    @Bean
    @Order(-2)
    public WebFilter websocketLoggingFilter() {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getPath().value();

            if (path.startsWith("/room/")) {
                System.out.println("\n🔌 === TENTATIVE DE CONNEXION WEBSOCKET ===");
                System.out.println("URI: " + request.getURI());
                System.out.println("Path: " + path);
                System.out.println("Method: " + request.getMethod());
                System.out.println("Headers:");
                request.getHeaders().forEach((key, value) -> {
                    if (key.toLowerCase().contains("sec-websocket")) {
                        System.out.println("  🔑 " + key + ": " + value);
                    } else {
                        System.out.println("  " + key + ": " + value);
                    }
                });
                System.out.println("=========================================\n");
            }

            return chain.filter(exchange);
        };
    }
}