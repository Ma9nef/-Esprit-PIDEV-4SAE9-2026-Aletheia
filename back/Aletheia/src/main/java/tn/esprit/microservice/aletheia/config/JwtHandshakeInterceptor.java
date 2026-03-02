package tn.esprit.microservice.aletheia.config;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.*;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.*;
import org.springframework.web.socket.server.HandshakeInterceptor;
import tn.esprit.microservice.aletheia.security.JwtService;

import java.util.Map;

@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) throws Exception {

        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpRequest = servletRequest.getServletRequest();
            String token = httpRequest.getParameter("token");

            if (token != null) {
                String username = jwtService.extractUsername(token);
                if (username != null && jwtService.isTokenValid(token)) {
                    var userDetails = userDetailsService.loadUserByUsername(username);
                    attributes.put("user", userDetails);
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {
    }
}
