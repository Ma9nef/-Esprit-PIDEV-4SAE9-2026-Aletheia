package com.example.offer.repository;


import com.example.offer.model.Offer;
import com.example.offer.model.OfferStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OfferRepository extends MongoRepository<Offer, String> {
    // ✅ AJOUTER CETTE MÉTHODE
    List<Offer> findByStatus(OfferStatus status);
    List<Offer> findByStatus(String status);

    List<Offer> findByStartDateBeforeAndEndDateAfter(
            LocalDateTime now1,
            LocalDateTime now2
    );
    // Optionnel: autres méthodes utiles
    boolean existsByName(String name);
    Offer findByName(String name);
}
