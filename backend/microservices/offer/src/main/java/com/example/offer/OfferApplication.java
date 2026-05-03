package com.example.offer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableMongoRepositories(basePackages = {
        "com.example.offer.repository",
        "com.example.offer.analytics"
})
public class OfferApplication {

    public static void main(String[] args) {
        SpringApplication.run(OfferApplication.class, args);
    }

}
