package com.example.offer.repository;

import com.example.offer.model.Subscription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends MongoRepository<Subscription, String> {

    List<Subscription> findByUserId(String userId);

    Optional<Subscription> findBySubscriptionNumber(String subscriptionNumber);

    List<Subscription> findByUserIdAndStatus(String userId, String status);

    @Query("{ 'userId': ?0, 'status': 'ACTIVE', 'endDate': { $gt: ?1 } }")
    Optional<Subscription> findActiveSubscriptionByUserId(String userId, LocalDateTime now);

    List<Subscription> findByStatusAndEndDateBefore(String status, LocalDateTime date);

    List<Subscription> findByPlanId(String planId);

    Long countByStatus(String status);

    @Query("{ 'status': 'ACTIVE', 'endDate': { $lt: ?0 } }")
    List<Subscription> findExpiredSubscriptions(LocalDateTime now);
}