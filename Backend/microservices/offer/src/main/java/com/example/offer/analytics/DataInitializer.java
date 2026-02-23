package com.example.offer.analytics;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final OfferHistoryRepository repository;

    @Override
    public void run(String... args) throws Exception {
        // Vérifier si la base est vide
        if (repository.count() == 0) {
            System.out.println("📦 Ajout de données de test...");

            Random random = new Random();
            String[] offerTypes = {"FLASH_SALE", "OFFRE", "COUPON"};
            String[] instructors = {"instructor_1", "instructor_2", "instructor_3", "instructor_4"};
            String[] users = {"user_1", "user_2", "user_3", "user_4", "user_5", "user_6", "user_7", "user_8"};

            LocalDateTime now = LocalDateTime.now();

            for (int i = 0; i < 50; i++) {
                OfferHistory history = new OfferHistory();
                history.setId(UUID.randomUUID().toString());
                history.setOfferId(UUID.randomUUID().toString());

                // Type d'offre aléatoire
                String offerType = offerTypes[random.nextInt(offerTypes.length)];
                history.setOfferType(offerType);

                // Instructeur aléatoire
                history.setInstructorId(instructors[random.nextInt(instructors.length)]);

                // Utilisateur aléatoire
                history.setUserId(users[random.nextInt(users.length)]);

                // Prix original entre 50 et 200€
                double originalPrice = 50 + random.nextInt(150);
                history.setOriginalPrice(originalPrice);

                // Réduction selon le type d'offre
                double discountAmount;
                if (offerType.equals("FLASH_SALE")) {
                    discountAmount = originalPrice * (0.3 + random.nextDouble() * 0.3);
                } else if (offerType.equals("COUPON")) {
                    discountAmount = originalPrice * (0.1 + random.nextDouble() * 0.2);
                } else {
                    discountAmount = originalPrice * (0.05 + random.nextDouble() * 0.15);
                }
                history.setDiscountAmount(discountAmount);

                // Prix final
                history.setFinalPrice(originalPrice - discountAmount);

                // Date d'achat aléatoire
                int daysAgo = random.nextInt(180);
                history.setPurchaseDate(now.minusDays(daysAgo));

                repository.save(history);
            }

            System.out.println("✅ 50 enregistrements de test ajoutés !");

        } else {
            System.out.println("📊 La base contient déjà " + repository.count() + " enregistrements");
        }
    }
}