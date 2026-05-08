package com.esprit.microservice.events.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.*;
import com.esprit.microservice.events.security.JwtService;
import com.esprit.microservice.events.service.RoomWebSocketHandler;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final JwtService jwtService;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        RoomWebSocketHandler handler = new RoomWebSocketHandler();
        handler.setJwtService(jwtService); // Injecter le service JWT

        registry.addHandler(handler, "/room/**")
                .addInterceptors(new JwtHandshakeInterceptor(jwtService))
                .setAllowedOrigins("http://localhost:4200");
    }
}