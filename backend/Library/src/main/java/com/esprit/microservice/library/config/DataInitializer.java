package com.esprit.microservice.library.config;

import com.esprit.microservice.library.entity.Product;
import com.esprit.microservice.library.enums.ProductType;
import com.esprit.microservice.library.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(ProductRepository productRepository) {
        return args -> {
            // Only insert sample data if database is empty
            if (productRepository.count() == 0) {
                System.out.println("===============================================");
                System.out.println("Database is empty. Initializing sample products...");
                System.out.println("===============================================");

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

                System.out.println("===============================================");
                System.out.println("Sample products created successfully!");
                System.out.println("Total products in database: " + productRepository.count());
                System.out.println("===============================================");
            } else {
                System.out.println("===============================================");
                System.out.println("Database already has " + productRepository.count() + " products.");
                System.out.println("Skipping initialization.");
                System.out.println("===============================================");
            }
        };
    }
}

