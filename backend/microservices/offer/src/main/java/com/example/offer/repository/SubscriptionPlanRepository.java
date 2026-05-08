package com.example.offer.repository;

import com.example.offer.model.SubscriptionPlan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPlanRepository extends MongoRepository<SubscriptionPlan, String> {

    Optional<SubscriptionPlan> findByName(String name);

    List<SubscriptionPlan> findByIsActiveTrue();

    List<SubscriptionPlan> findByIsActiveTrueOrderByPriceAsc();

    List<SubscriptionPlan> findByPriceLessThanEqual(Double maxPrice);
}