package com.esprit.microservice.library.config;

import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.enums.ProductType;
import com.esprit.microservice.library.repository.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Profile("dev")
@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initializeData(ProductRepository productRepository, DataSource dataSource) {
        return args -> {
            // Ensure columns can hold large data (base64 data URLs for auto-generated covers)
            try (Connection conn = dataSource.getConnection(); Statement stmt = conn.createStatement()) {
                stmt.executeUpdate("ALTER TABLE products MODIFY COLUMN cover_image_url LONGTEXT");
                stmt.executeUpdate("ALTER TABLE products MODIFY COLUMN file_url TEXT");
                stmt.executeUpdate("ALTER TABLE order_items MODIFY COLUMN cover_image_url LONGTEXT");
                stmt.executeUpdate("ALTER TABLE order_items MODIFY COLUMN file_url TEXT");
                log.info("Column types updated for products and order_items tables");
            } catch (Exception e) {
                // Table may not exist yet on first run — Hibernate will create it with correct types
                log.debug("Column migration skipped: {}", e.getMessage());
            }

            // Only insert sample data if database is empty
            if (productRepository.count() == 0) {
                log.info("Database is empty, initializing sample products...");

                // Create sample products
                Product product1 = new Product(
                        "Spring Boot Complete Guide",
                        "Comprehensive guide to building microservices with Spring Boot and Spring Cloud.",
                        "John Doe",
                        ProductType.BOOK,
                        0.0,
                        "https://example.com/spring-boot.pdf",
                        "https://example.com/spring-boot-cover.jpg",
                        true
                );

                Product product2 = new Product(
                        "Angular Best Practices",
                        "Learn modern Angular patterns, dependency injection, and reactive programming with RxJS.",
                        "Jane Smith",
                        ProductType.PDF,
                        0.0,
                        "https://example.com/angular-best-practices.pdf",
                        "https://example.com/angular-cover.jpg",
                        true
                );

                Product product3 = new Product(
                        "Python Data Science Tutorial",
                        "Master data manipulation, analysis, and visualization with Python, NumPy, Pandas, and Matplotlib.",
                        "Alex Johnson",
                        ProductType.BOOK,
                        0.0,
                        "https://example.com/python-ds.pdf",
                        "https://example.com/python-cover.jpg",
                        true
                );

                Product product4 = new Product(
                        "Docker & Kubernetes Essentials",
                        "Complete guide to containerization and orchestration technologies for modern DevOps.",
                        "Mike Davis",
                        ProductType.PDF,
                        0.0,
                        "https://example.com/docker-k8s.pdf",
                        "https://example.com/docker-cover.jpg",
                        true
                );

                Product product5 = new Product(
                        "Children's Learning Stories",
                        "Collection of educational and entertaining stories for children ages 5-12.",
                        "Sarah Wilson",
                        ProductType.CHILDREN_MATERIAL,
                        0.0,
                        "https://example.com/children-stories.pdf",
                        "https://example.com/children-cover.jpg",
                        true
                );

                Product product6 = new Product(
                        "Mathematics Exam Preparation",
                        "Complete exam preparation material covering algebra, geometry, calculus, and statistics.",
                        "Tom Brown",
                        ProductType.EXAM,
                        0.0,
                        "https://example.com/math-exam.pdf",
                        "https://example.com/math-cover.jpg",
                        true
                );

                // Save all products
                productRepository.save(product1);
                productRepository.save(product2);
                productRepository.save(product3);
                productRepository.save(product4);
                productRepository.save(product5);
                productRepository.save(product6);

                log.info("Sample products created. Total: {}", productRepository.count());
            } else {
                log.info("Database already has {} products, skipping initialization.", productRepository.count());
            }
        };
    }
}
