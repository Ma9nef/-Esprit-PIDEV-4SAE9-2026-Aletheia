// package com.esprit.microservice.apigateway.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.reactive.HandlerMapping;
// import org.springframework.web.reactive.handler.SimpleUrlHandlerMapping;
// import org.springframework.web.reactive.socket.WebSocketHandler;
// import org.springframework.web.reactive.socket.server.support.WebSocketHandlerAdapter;
// import reactor.core.publisher.Mono;

// import java.util.HashMap;
// import java.util.Map;

// @Configuration
// public class WebSocketGatewayConfig {

//     @Bean
//     public HandlerMapping webSocketHandlerMapping() {
//         Map<String, WebSocketHandler> map = new HashMap<>();
//         map.put("/room/**", session -> {
//             // Proxy WebSocket vers le microservice events
//             return Mono.empty(); // La configuration se fait via les routes Gateway
//         });

//         SimpleUrlHandlerMapping handlerMapping = new SimpleUrlHandlerMapping();
//         handlerMapping.setUrlMap(map);
//         handlerMapping.setOrder(-1); // Priorité haute
//         return handlerMapping;
//     }

//     @Bean
//     public WebSocketHandlerAdapter handlerAdapter() {
//         return new WebSocketHandlerAdapter();
//     }
// }