package com.example.offer.repository;

import com.example.offer.model.Subscription;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataMongoTest
@ActiveProfiles("test")
class SubscriptionRepositoryIntegrationTest {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @AfterEach
    void cleanUp() {
        subscriptionRepository.deleteAll();
    }

    @Test
    void findActiveSubscriptionByUserId_shouldReturnOnlyActiveAndNotExpiredSubscription() {
        subscriptionRepository.save(subscription("active-1", "user-1", "ACTIVE", LocalDateTime.now().plusDays(5)));
        subscriptionRepository.save(subscription("expired-1", "user-1", "ACTIVE", LocalDateTime.now().minusDays(1)));
        subscriptionRepository.save(subscription("canceled-1", "user-1", "CANCELED", LocalDateTime.now().plusDays(5)));

        Optional<Subscription> result = subscriptionRepository.findActiveSubscriptionByUserId("user-1", LocalDateTime.now());

        assertTrue(result.isPresent());
        assertEquals("active-1", result.get().getId());
    }

    @Test
    void findByStatusAndEndDateBefore_shouldReturnExpiredCandidates() {
        subscriptionRepository.save(subscription("sub-1", "user-1", "ACTIVE", LocalDateTime.now().minusDays(1)));
        subscriptionRepository.save(subscription("sub-2", "user-2", "ACTIVE", LocalDateTime.now().plusDays(2)));
        subscriptionRepository.save(subscription("sub-3", "user-3", "CANCELED", LocalDateTime.now().minusDays(2)));

        List<Subscription> expired = subscriptionRepository.findByStatusAndEndDateBefore("ACTIVE", LocalDateTime.now());

        assertEquals(1, expired.size());
        assertEquals("sub-1", expired.get(0).getId());
    }

    @Test
    void findByStatusAndEndDateBetween_shouldReturnExpiringSoonSubscriptions() {
        subscriptionRepository.save(subscription("sub-1", "user-1", "ACTIVE", LocalDateTime.now().plusDays(2)));
        subscriptionRepository.save(subscription("sub-2", "user-2", "ACTIVE", LocalDateTime.now().plusDays(10)));

        List<Subscription> expiringSoon = subscriptionRepository.findByStatusAndEndDateBetween(
                "ACTIVE",
                LocalDateTime.now(),
                LocalDateTime.now().plusDays(3)
        );

        assertEquals(1, expiringSoon.size());
        assertEquals("sub-1", expiringSoon.get(0).getId());
    }

    private Subscription subscription(String id, String userId, String status, LocalDateTime endDate) {
        Subscription subscription = new Subscription();
        subscription.setId(id);
        subscription.setUserId(userId);
        subscription.setPlanId("plan-1");
        subscription.setSubscriptionNumber("SUB-" + id);
        subscription.setStatus(status);
        subscription.setStartDate(endDate.minusDays(30));
        subscription.setEndDate(endDate);
        subscription.setCreatedAt(LocalDateTime.now().minusDays(5));
        subscription.setUpdatedAt(LocalDateTime.now());
        return subscription;
    }
}
