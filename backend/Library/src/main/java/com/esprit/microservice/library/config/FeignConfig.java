package com.esprit.microservice.library.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import feign.Logger;
import feign.RequestInterceptor;
import feign.codec.Decoder;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

/**
 * Global Feign configuration.
 * Propagates the incoming JWT Authorization header to all outbound Feign calls.
 * Also provides an explicit JSON decoder so spring-boot-starter-data-rest's
 * HAL media-type customisation does not break plain application/json responses.
 */
@Configuration
public class FeignConfig {

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.BASIC;
    }

    @Bean
    public RequestInterceptor jwtPropagationInterceptor() {
        return requestTemplate -> {
            ServletRequestAttributes attributes =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String auth = request.getHeader("Authorization");
                if (auth != null && auth.startsWith("Bearer ")) {
                    requestTemplate.header("Authorization", auth);
                }
            }
        };
    }

    /**
     * Direct Jackson decoder — bypasses Spring Boot's HttpMessageConverters entirely.
     * Needed because spring-boot-starter-data-rest strips application/json support
     * from the global MappingJackson2HttpMessageConverter in Spring Boot 4.x.
     */
    @Bean
    public Decoder feignDecoder(ObjectMapper objectMapper) {
        return (response, type) -> {
            if (response.body() == null) return null;
            return objectMapper.readValue(
                    response.body().asInputStream(),
                    objectMapper.getTypeFactory().constructType(type)
            );
        };
    }
}
