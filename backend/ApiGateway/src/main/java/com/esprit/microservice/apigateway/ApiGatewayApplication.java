package com.esprit.microservice.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder){
        return builder.routes()
                .route("user-service", r -> r.path("/api/users/**").uri("lb://aletheia-platform"))
                .route("courses-service", r -> r.path("/api/courses/**").uri("lb://courses"))
                .route("library-service", r -> r.path("/api/library/**").uri("lb://library-service"))
                .route("products-service", r -> r.path("/api/products/**").uri("lb://library-service"))
                .route("cart-service", r -> r.path("/api/cart/**").uri("lb://library-service"))
                .route("orders-service", r -> r.path("/api/orders/**").uri("lb://library-service"))
                .route("files-service", r -> r.path("/api/files/**").uri("lb://library-service"))
                .route("user-service", r -> r.path("/api/users/**").uri("lb://ALETHEIA-PLATFORM"))
                .route("courses-service", r -> r.path("/course/**").uri("lb://COURSES-SERVICE"))
                .route("courses-instructor", r -> r.path("/instructor/**").uri("lb://COURSES-SERVICE"))
                .route("courses-lesson", r -> r.path("/lesson/**").uri("lb://COURSES-SERVICE"))
                .route("library-service", r -> r.path("/api/library/**").uri("lb://LIBRARY-SERVICE"))
                .route("products-service", r -> r.path("/api/products/**").uri("lb://LIBRARY-SERVICE"))
                .route("cart-service", r -> r.path("/api/cart/**").uri("lb://LIBRARY-SERVICE"))
                .route("orders-service", r -> r.path("/api/orders/**").uri("lb://LIBRARY-SERVICE"))
                // --- NEW ROUTES FOR THE 4 CONTROLLERS ---

                // Routes for Assessment, Certificate, and Questions (all start with /pidev)
                .route("pidev-features", r -> r.path("/pidev/**")
                        .uri("lb://COURSES-SERVICE"))

                // Route for Submissions (starts with /api/assessment-results)
                .route("assessment-results", r -> r.path("/api/assessment-results/**")
                        .uri("lb://COURSES-SERVICE"))


                .build();
    }
}