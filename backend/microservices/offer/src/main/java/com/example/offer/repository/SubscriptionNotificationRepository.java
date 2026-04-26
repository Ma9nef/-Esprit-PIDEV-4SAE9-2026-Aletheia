package com.example.offer.repository;

import com.example.offer.model.NotificationRecipientType;
import com.example.offer.model.SubscriptionNotification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionNotificationRepository extends MongoRepository<SubscriptionNotification, String> {

    List<SubscriptionNotification> findByRecipientTypeAndRecipientIdOrderByCreatedAtDesc(
            NotificationRecipientType recipientType,
            String recipientId
    );

    List<SubscriptionNotification> findByRecipientTypeOrderByCreatedAtDesc(NotificationRecipientType recipientType);

    long countByRecipientTypeAndRecipientIdAndReadFalse(NotificationRecipientType recipientType, String recipientId);

    long countByRecipientTypeAndReadFalse(NotificationRecipientType recipientType);

    List<SubscriptionNotification> findByRecipientTypeAndRecipientIdAndReadFalse(
            NotificationRecipientType recipientType,
            String recipientId
    );

    List<SubscriptionNotification> findByRecipientTypeAndReadFalse(NotificationRecipientType recipientType);

    Optional<SubscriptionNotification> findByDeduplicationKey(String deduplicationKey);
}
