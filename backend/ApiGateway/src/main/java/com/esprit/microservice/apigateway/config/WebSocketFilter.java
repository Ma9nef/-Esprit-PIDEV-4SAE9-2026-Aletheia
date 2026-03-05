package com.esprit.microservice.apigateway.config;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class WebSocketFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().value();

        // Vérifier si c'est une requête WebSocket
        if (path.startsWith("/room/")) {
            System.out.println("🔌 Requête WebSocket détectée: " + path);

            // Vérifier les headers d'upgrade
            String upgrade = request.getHeaders().getFirst("Upgrade");
            String connection = request.getHeaders().getFirst("Connection");

            if ("websocket".equalsIgnoreCase(upgrade) && "Upgrade".equalsIgnoreCase(connection)) {
                System.out.println("✅ Headers WebSocket valides");
            }
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -2; // S'exécute très tôt dans la chaîne
    }
}