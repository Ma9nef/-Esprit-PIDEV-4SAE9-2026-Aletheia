package com.example.offer.repository;

import com.example.offer.model.SubscriptionPayment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPaymentRepository extends MongoRepository<SubscriptionPayment, String> {

    List<SubscriptionPayment> findAllByOrderByCreatedAtDesc();

    List<SubscriptionPayment> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<SubscriptionPayment> findByStripeSessionId(String stripeSessionId);

    Optional<SubscriptionPayment> findByStripePaymentIntentId(String stripePaymentIntentId);
}
