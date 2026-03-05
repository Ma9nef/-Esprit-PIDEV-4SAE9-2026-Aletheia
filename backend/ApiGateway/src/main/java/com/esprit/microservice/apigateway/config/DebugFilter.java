package com.esprit.microservice.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.web.server.WebFilter;
import reactor.core.publisher.Mono;

@Configuration
public class DebugFilter {

    @Bean(name = "customDebugFilter")  // Nom unique
    @Order(-1)
    public WebFilter debugFilter() {
        return (exchange, chain) -> {
            System.out.println("\n🔍 === DEBUG FILTER (TOUJOURS EXÉCUTÉ) ===");
            System.out.println("Timestamp: " + System.currentTimeMillis());
            System.out.println("URI: " + exchange.getRequest().getURI());
            System.out.println("Method: " + exchange.getRequest().getMethod());
            System.out.println("Path: " + exchange.getRequest().getPath());
            System.out.println("Remote Address: " + exchange.getRequest().getRemoteAddress());

            HttpHeaders headers = exchange.getRequest().getHeaders();
            System.out.println("\n📋 HEADERS REÇUS (" + headers.size() + "):");

            final boolean[] hasAuth = {false};

            headers.forEach((headerName, headerValues) -> {
                String firstValue = headerValues.isEmpty() ? "" : headerValues.get(0);

                if (headerName.equalsIgnoreCase("authorization")) {
                    hasAuth[0] = true;
                    String displayValue = firstValue.length() > 30 ?
                            firstValue.substring(0, 30) + "..." : firstValue;
                    System.out.println("  ✅ " + headerName + ": " + displayValue);
                } else {
                    System.out.println("  " + headerName + ": " + firstValue);
                }
            });

            if (!hasAuth[0]) {
                System.out.println("\n  ❌ ERREUR: AUCUN HEADER AUTHORIZATION TROUVÉ !");
                System.out.println("  Le token n'est pas envoyé par le client");
                System.out.println("  Causes possibles:");
                System.out.println("    - Postman: vérifiez l'onglet Authorization ou Headers");
                System.out.println("    - Token: peut-être mal formaté ou absent");
                System.out.println("    - CORS: les headers pourraient être bloqués");
            } else {
                System.out.println("\n  ✅ Header Authorization présent et transmis");
            }

            System.out.println("========================================\n");

            return chain.filter(exchange);
        };
    }
}