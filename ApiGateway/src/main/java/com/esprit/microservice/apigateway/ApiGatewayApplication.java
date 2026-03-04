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

        // return builder.routes() .route("candidat",r->r.path("/mic1/**")
        //     .uri("http://localhost:8081") )
        //.route("candidat",r->r.path("/mic1/**")
        //     .uri("http://localhost:8090") )
        //  .route("job",r->r.path("/mic2/**")
        //     .uri("http://localhost:8082") )
        // .route("candidature",r->r.path("/mic3/**")
        //       .uri("http://localhost:8083") )
        //  .route("meeting",r->r.path("/mic5/**")
        //     .uri("http://localhost:8085") )
        //  .build();
        //
        return builder.routes() .route("library",r->r.path("/api/library/**")
                        .uri("lb://Library-service") )
                .build();
    }
}