package com.esprit.microservice.resourcemanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages = "com.esprit.microservice.resourcemanagement.repository")
public class JpaConfig {
    // Transaction management and JPA repository scanning configured here.
    // Pessimistic locking (PESSIMISTIC_WRITE) requires proper transaction boundaries,
    // which are provided by @Transactional annotations on service methods.
}
