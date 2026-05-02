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
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()

                // USER SERVICE
                .route("user-service", r -> r.path("/api/users/**")
                        .uri("lb://ALETHEIA-PLATFORM"))

                // COURSES SERVICE
                .route("courses-api", r -> r.path("/api/courses/**")
                        .uri("http://localhost:8081"))
                .route("courses-legacy", r -> r.path("/course/**")
                        .uri("http://localhost:8081"))
                .route("courses-instructor", r -> r.path("/api/instructor/**")
                        .uri("http://localhost:8081"))
                .route("courses-lesson", r -> r.path("/api/lesson/**")
                        .uri("http://localhost:8081"))
                .route("pidev-features", r -> r.path("/pidev/**")
                        .uri("http://localhost:8081"))
                .route("assessment-results", r -> r.path("/api/assessment-results/**")
                        .uri("http://localhost:8081"))

                // LIBRARY SERVICE
                .route("library-service", r -> r.path("/api/library/**")
                        .uri("lb://LIBRARY-SERVICE"))
                .route("products-service", r -> r.path("/api/products/**")
                        .uri("lb://LIBRARY-SERVICE"))
                .route("cart-service", r -> r.path("/api/cart/**")
                        .uri("lb://LIBRARY-SERVICE"))
                .route("orders-service", r -> r.path("/api/orders/**")
                        .uri("lb://LIBRARY-SERVICE"))
                .route("files-service", r -> r.path("/api/files/**")
                        .uri("lb://LIBRARY-SERVICE"))

                // OFFER SERVICE
                .route("offer-service", r -> r.path("/api/offers/**")
                        .uri("lb://OFFER"))
                .route("flash-sales", r -> r.path("/api/flash-sales/**")
                        .uri("lb://OFFER"))
                .route("coupons", r -> r.path("/api/coupons/**")
                        .uri("lb://OFFER"))
                .route("analytics", r -> r.path("/api/analytics/**")
                        .uri("lb://OFFER"))
                .route("subscription-plans", r -> r.path("/api/subscription-plans/**")
                        .uri("lb://OFFER"))
                .route("subscriptions", r -> r.path("/api/subscriptions/**")
                        .uri("lb://OFFER"))

                // EVENT SERVICE
                .route("event-service", r -> r.path("/api/events/**")
                        .uri("lb://EVENT-MICROSERVICE"))
                .route("event-websocket", r -> r.path("/room/**")
                        .uri("lb://EVENT-MICROSERVICE"))


                // USER SERVICE
                .route("user-service", r -> r.path("/api/users/**")
                        .filters(f -> f
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                        .uri("lb://ALETHEIA-PLATFORM"))

                // COURSES SERVICE
                .route("courses-api", r -> r.path("/api/courses/**")
                        .filters(f -> f
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                        .uri("http://localhost:8081"))
                .route("formations-api", r -> r.path("/api/formations/**")
                        .filters(f -> f
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                        .uri("http://localhost:8081"))
                .route("courses-legacy", r -> r.path("/course/**")
                        .filters(f -> f
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                        .uri("http://localhost:8081"))
                .route("courses-instructor", r -> r.path("/api/instructor/**")
                        .filters(f -> f
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                        .uri("http://localhost:8081"))
                .route("courses-lesson", r -> r.path("/api/lesson/learn/**")
                        .filters(f -> f.rewritePath("/api/(?<segment>.*)", "/${segment}"))
                        .uri("http://localhost:8081"))
                .route("pidev-features", r -> r.path("/pidev/**")
                        .filters(f -> f
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                        .uri("lb://COURSES-SERVICE"))
                .route("courses-lesson-instructor", r -> r.path("/api/lesson/instructor/**")
                        .filters(f -> f
                                .rewritePath("/api/(?<segment>.*)", "/${segment}")
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                        .uri("http://localhost:8081"))
                // Route for Submissions (starts with /api/assessment-results)
                .route("assessments", r -> r.path("/api/assessments/**")
                        .filters(f -> f
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                        .uri("lb://COURSES-SERVICE"))

                .route("assessment-results", r -> r.path("/api/assessment-results/**")
                        .filters(f -> f
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                        .uri("lb://COURSES-SERVICE"))
                .route("formations-admin", r -> r.path("/api/admin/formations", "/api/admin/formations/**")
                        .filters(f -> f
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                        .uri("http://localhost:8081"))

                // LIBRARY SERVICE
                .route("library-service", r -> r.path("/api/library/**")
                        .uri("lb://LIBRARY-SERVICE"))
                .route("products-service", r -> r.path("/api/products/**")
                        .uri("lb://LIBRARY-SERVICE"))
                .route("cart-service", r -> r.path("/api/cart/**")
                        .uri("lb://LIBRARY-SERVICE"))
                .route("orders-service", r -> r.path("/api/orders/**")
                        .uri("lb://LIBRARY-SERVICE"))
                .route("files-service", r -> r.path("/api/files/**")
                        .uri("lb://LIBRARY-SERVICE"))
                .route("loans-service", r -> r.path("/api/loans/**")
                        .uri("lb://LIBRARY-SERVICE"))
                .route("borrowing-policies", r -> r.path("/api/policies/**")
                        .uri("lb://LIBRARY-SERVICE"))
                .route("inventory-analytics", r -> r.path("/api/inventory-analytics/**")
                        .uri("lb://LIBRARY-SERVICE"))

                // OFFER SERVICE
                .route("offer-service", r -> r.path("/api/offers/**")
                        .uri("lb://OFFER"))
                .route("flash-sales", r -> r.path("/api/flash-sales/**")
                        .uri("lb://OFFER"))
                .route("coupons", r -> r.path("/api/coupons/**")
                        .uri("lb://OFFER"))
                .route("analytics", r -> r.path("/api/analytics/**")
                        .uri("lb://OFFER"))
                .route("subscription-plans", r -> r.path("/api/subscription-plans/**")
                        .uri("lb://OFFER"))
                .route("catalog-api", r -> r.path("/api/catalog", "/api/catalog/**")
                        .filters(f -> f
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                        .uri("http://localhost:8081"))
                // EVENT SERVICE
                .route("event-service", r -> r.path("/api/events/**")
                        .uri("lb://EVENT-MICROSERVICE"))
                .route("event-websocket", r -> r.path("/room/**")
                        .uri("lb://EVENT-MICROSERVICE"))

                // RESOURCE MANAGEMENT SERVICE
                .route("resources-service", r -> r.path("/api/resources/**")
                        .uri("lb://RESOURCEMANAGEMENT"))
                .route("reservations-service", r -> r.path("/api/reservations/**")
                        .uri("lb://RESOURCEMANAGEMENT"))

                // NOTIFICATION SERVICE
                .route("notification-service", r -> r.path("/api/notifications/**")
                        .uri("lb://NOTIFICATION"))

                // USER SERVICE — auth & admin (otherwise POST /api/auth/login → 404)
                .route("user-auth", r -> r.path("/api/auth/**")
                        .filters(f -> f
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                        .uri("lb://ALETHEIA-PLATFORM"))
                .route("user-admin-users", r -> r.path("/api/admin/users/**")
                        .filters(f -> f
                                .dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_FIRST")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                        .uri("lb://ALETHEIA-PLATFORM"))

                .build();
    }
}