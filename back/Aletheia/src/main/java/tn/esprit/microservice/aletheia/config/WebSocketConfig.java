package tn.esprit.microservice.aletheia.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.config.annotation.*;
import tn.esprit.microservice.aletheia.security.JwtService;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketConfigurer {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new RoomWebSocketHandler(), "/room/*")
                .addInterceptors(new JwtHandshakeInterceptor(jwtService, userDetailsService))
                .setAllowedOrigins("*");
    }
}
