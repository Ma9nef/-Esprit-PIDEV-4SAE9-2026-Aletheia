package com.example.offer.analytics;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Profile("dev")
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final OfferHistoryRepository repository;

    @Override
    public void run(String... args) throws Exception {
        // Check if database is empty
        if (repository.count() == 0) {
            log.info("Adding test data to offer history...");

            Random random = new Random();
            String[] offerTypes = {"FLASH_SALE", "OFFER", "COUPON"};
            String[] instructors = {"instructor_1", "instructor_2", "instructor_3", "instructor_4"};
            String[] users = {"user_1", "user_2", "user_3", "user_4", "user_5", "user_6", "user_7", "user_8"};

            LocalDateTime now = LocalDateTime.now();

            for (int i = 0; i < 50; i++) {
                OfferHistory history = new OfferHistory();
                history.setId(UUID.randomUUID().toString());
                history.setOfferId(UUID.randomUUID().toString());

                // Random offer type
                String offerType = offerTypes[random.nextInt(offerTypes.length)];
                history.setOfferType(offerType);

                // Random instructor
                history.setInstructorId(instructors[random.nextInt(instructors.length)]);

                // Random user
                history.setUserId(users[random.nextInt(users.length)]);

                // Original price between 50 and 200€
                double originalPrice = 50 + random.nextInt(150);
                history.setOriginalPrice(originalPrice);

                // Discount based on offer type
                double discountAmount;
                if (offerType.equals("FLASH_SALE")) {
                    discountAmount = originalPrice * (0.3 + random.nextDouble() * 0.3);
                } else if (offerType.equals("COUPON")) {
                    discountAmount = originalPrice * (0.1 + random.nextDouble() * 0.2);
                } else {
                    discountAmount = originalPrice * (0.05 + random.nextDouble() * 0.15);
                }
                history.setDiscountAmount(discountAmount);

                // Final price
                history.setFinalPrice(originalPrice - discountAmount);

                // Random purchase date
                int daysAgo = random.nextInt(180);
                history.setPurchaseDate(now.minusDays(daysAgo));

                repository.save(history);
            }

            log.info("50 test records added to offer history.");

        } else {
            log.info("Database already contains {} records, skipping seed.", repository.count());
        }
    }
}