package com.example.offer.repository;

import com.example.offer.model.FlashSale;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlashSaleRepository extends MongoRepository<FlashSale, String> {

    // Recherche des ventes flash actives
    List<FlashSale> findByIsActiveTrueAndStartTimeBeforeAndEndTimeAfter(
            LocalDateTime startTime, LocalDateTime endTime);

    // Recherche des ventes flash mises en avant
   // List<FlashSale> findByIsFeaturedTrueAndStartTimeBeforeAndEndTimeAfter(
     //       LocalDateTime startTime, LocalDateTime endTime);

    // Recherche par offre
    List<FlashSale> findByOfferId(String offerId);

    // Recherche des ventes flash qui commencent bientôt
    @Query("{ 'startTime': { $gte: ?0, $lte: ?1 }, 'isActive': true }")
    List<FlashSale> findUpcomingFlashSales(LocalDateTime start, LocalDateTime end);

    // Recherche des ventes flash expirées
    List<FlashSale> findByEndTimeBeforeAndIsActiveTrue(LocalDateTime now);
}