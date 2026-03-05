package com.esprit.microservice.apigateway.config;

import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.NettyRoutingFilter;
import org.springframework.cloud.gateway.filter.factory.rewrite.ModifyResponseBodyGatewayFilterFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import reactor.core.publisher.Mono;

@Configuration
public class WebSocketRoutingFilter {

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public GlobalFilter websocketFilter() {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getURI().getPath();

            if (path.startsWith("/room/")) {
                System.out.println("🔌 WebSocket request detected: " + path);
                System.out.println("   Headers: " + exchange.getRequest().getHeaders());
            }

            return chain.filter(exchange);
        };
    }
}