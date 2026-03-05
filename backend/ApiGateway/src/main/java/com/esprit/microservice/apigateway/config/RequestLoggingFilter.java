package com.esprit.microservice.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.server.WebFilter;
import reactor.core.publisher.Mono;

@Configuration
public class RequestLoggingFilter {

    @Bean
    public WebFilter loggingFilter() {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            System.out.println("\n=== REQUÊTE REÇUE PAR API GATEWAY ===");
            System.out.println("URI: " + request.getURI());
            System.out.println("Method: " + request.getMethod());
            System.out.println("Headers:");
            request.getHeaders().forEach((key, value) ->
                    System.out.println("  " + key + ": " + value)
            );
            System.out.println("=====================================\n");
            return chain.filter(exchange);
        };
    }
}