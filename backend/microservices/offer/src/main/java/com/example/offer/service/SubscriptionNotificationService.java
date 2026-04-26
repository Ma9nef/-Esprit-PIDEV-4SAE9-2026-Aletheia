package com.example.offer.service;

import com.example.offer.dto.SubscriptionNotificationResponseDTO;
import com.example.offer.model.NotificationRecipientType;
import com.example.offer.model.Subscription;
import com.example.offer.model.SubscriptionNotification;
import com.example.offer.model.SubscriptionNotificationType;
import com.example.offer.model.SubscriptionPlan;
import com.example.offer.repository.SubscriptionNotificationRepository;
import com.example.offer.repository.SubscriptionPlanRepository;
import com.example.offer.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionNotificationService {

    private static final int DEFAULT_EXPIRATION_REMINDER_DAYS = 3;

    private final SubscriptionNotificationRepository notificationRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;

    public List<SubscriptionNotificationResponseDTO> getUserNotifications(String userId) {
        return notificationRepository.findByRecipientTypeAndRecipientIdOrderByCreatedAtDesc(
                NotificationRecipientType.USER,
                userId
        ).stream().map(this::toResponse).toList();
    }

    public List<SubscriptionNotificationResponseDTO> getAdminNotifications() {
        return notificationRepository.findByRecipientTypeOrderByCreatedAtDesc(NotificationRecipientType.ADMIN)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public long getUserUnreadCount(String userId) {
        return notificationRepository.countByRecipientTypeAndRecipientIdAndReadFalse(NotificationRecipientType.USER, userId);
    }

    public long getAdminUnreadCount() {
        return notificationRepository.countByRecipientTypeAndReadFalse(NotificationRecipientType.ADMIN);
    }

    public SubscriptionNotificationResponseDTO markAsRead(String notificationId) {
        SubscriptionNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification introuvable"));

        if (!notification.isRead()) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }

        return toResponse(notification);
    }

    public void markAllUserNotificationsAsRead(String userId) {
        List<SubscriptionNotification> notifications = notificationRepository.findByRecipientTypeAndRecipientIdAndReadFalse(
                NotificationRecipientType.USER,
                userId
        );
        markAllAsRead(notifications);
    }

    public void markAllAdminNotificationsAsRead() {
        List<SubscriptionNotification> notifications = notificationRepository.findByRecipientTypeAndReadFalse(
                NotificationRecipientType.ADMIN
        );
        markAllAsRead(notifications);
    }

    public void notifyPaymentFailed(String userId, String planId, String planName, String subscriptionId, String failureReason) {
        String safePlanName = safePlanName(planName);
        createUserAndAdminNotification(
                userId,
                SubscriptionNotificationType.PAYMENT_FAILED,
                "Payment failed",
                "Your payment for the " + safePlanName + " plan failed. " + defaultMessage(failureReason, "Please try again."),
                "Admin alert: payment failed",
                "A subscription payment failed for user " + userId + " on the " + safePlanName + " plan.",
                subscriptionId,
                planId,
                null
        );
    }

    public void notifySubscriptionRenewed(String userId, String planId, String planName, String subscriptionId) {
        String safePlanName = safePlanName(planName);
        createUserAndAdminNotification(
                userId,
                SubscriptionNotificationType.RENEWED,
                "Subscription renewed",
                "Your subscription has been renewed successfully on the " + safePlanName + " plan.",
                "Admin alert: subscription renewed",
                "A subscription renewal was completed successfully for user " + userId + " on the " + safePlanName + " plan.",
                subscriptionId,
                planId,
                null
        );
    }

    public void notifyPlanChanged(
            String userId,
            String previousPlanName,
            String newPlanName,
            String subscriptionId,
            String newPlanId
    ) {
        createUserAndAdminNotification(
                userId,
                SubscriptionNotificationType.PLAN_CHANGED,
                "Subscription plan changed",
                "Your subscription plan changed from " + safePlanName(previousPlanName) + " to " + safePlanName(newPlanName) + ".",
                "Admin alert: plan changed",
                "User " + userId + " changed subscription plan from " + safePlanName(previousPlanName) + " to "
                        + safePlanName(newPlanName) + ".",
                subscriptionId,
                newPlanId,
                null
        );
    }

    public void notifySubscriptionExpired(Subscription subscription, SubscriptionPlan plan) {
        createUserAndAdminNotification(
                subscription.getUserId(),
                SubscriptionNotificationType.SUBSCRIPTION_EXPIRED,
                "Subscription expired",
                "Your " + safePlanName(plan != null ? plan.getName() : null) + " subscription has expired.",
                "Admin alert: subscription expired",
                "Subscription " + subscription.getSubscriptionNumber() + " has expired for user " + subscription.getUserId() + ".",
                subscription.getId(),
                subscription.getPlanId(),
                "expired:" + subscription.getId()
        );
    }

    public void createExpirationReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime threshold = now.plusDays(DEFAULT_EXPIRATION_REMINDER_DAYS);

        List<Subscription> expiringSoon = subscriptionRepository.findByStatusAndEndDateBetween("ACTIVE", now, threshold);
        for (Subscription subscription : expiringSoon) {
            if (subscription.getEndDate() == null) {
                continue;
            }

            long daysRemaining = Math.max(0, java.time.Duration.between(now, subscription.getEndDate()).toDays());
            SubscriptionPlan plan = subscriptionPlanRepository.findById(subscription.getPlanId()).orElse(null);
            String deduplicationKey = "expiring:" + subscription.getId() + ":" + DEFAULT_EXPIRATION_REMINDER_DAYS;

            createUserAndAdminNotification(
                    subscription.getUserId(),
                    SubscriptionNotificationType.EXPIRING_SOON,
                    "Subscription expiring soon",
                    "Your " + safePlanName(plan != null ? plan.getName() : null)
                            + " subscription expires in " + Math.max(1, daysRemaining) + " day(s).",
                    "Admin alert: subscription expiring soon",
                    "Subscription " + subscription.getSubscriptionNumber() + " for user " + subscription.getUserId()
                            + " expires within " + DEFAULT_EXPIRATION_REMINDER_DAYS + " days.",
                    subscription.getId(),
                    subscription.getPlanId(),
                    deduplicationKey
            );
        }
    }

    private void createUserAndAdminNotification(
            String userId,
            SubscriptionNotificationType type,
            String userTitle,
            String userMessage,
            String adminTitle,
            String adminMessage,
            String subscriptionId,
            String planId,
            String deduplicationKey
    ) {
        createNotification(
                NotificationRecipientType.USER,
                userId,
                type,
                userTitle,
                userMessage,
                subscriptionId,
                planId,
                deduplicationKey != null ? deduplicationKey + ":user:" + userId : null
        );

        createNotification(
                NotificationRecipientType.ADMIN,
                null,
                type,
                adminTitle,
                adminMessage,
                subscriptionId,
                planId,
                deduplicationKey != null ? deduplicationKey + ":admin" : null
        );
    }

    private void createNotification(
            NotificationRecipientType recipientType,
            String recipientId,
            SubscriptionNotificationType type,
            String title,
            String message,
            String subscriptionId,
            String planId,
            String deduplicationKey
    ) {
        if (deduplicationKey != null && notificationRepository.findByDeduplicationKey(deduplicationKey).isPresent()) {
            return;
        }

        SubscriptionNotification notification = new SubscriptionNotification();
        notification.setRecipientType(recipientType);
        notification.setRecipientId(recipientId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setReadAt(null);
        notification.setRelatedSubscriptionId(subscriptionId);
        notification.setRelatedPlanId(planId);
        notification.setDeduplicationKey(deduplicationKey);
        notificationRepository.save(notification);
    }

    private void markAllAsRead(List<SubscriptionNotification> notifications) {
        if (notifications.isEmpty()) {
            return;
        }

        LocalDateTime readAt = LocalDateTime.now();
        notifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(readAt);
        });
        notificationRepository.saveAll(notifications);
    }

    private SubscriptionNotificationResponseDTO toResponse(SubscriptionNotification notification) {
        SubscriptionNotificationResponseDTO dto = new SubscriptionNotificationResponseDTO();
        dto.setNotificationId(notification.getId());
        dto.setRecipientType(notification.getRecipientType() != null ? notification.getRecipientType().name() : null);
        dto.setRecipientId(notification.getRecipientId());
        dto.setType(notification.getType() != null ? notification.getType().name() : null);
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setReadAt(notification.getReadAt());
        dto.setRelatedSubscriptionId(notification.getRelatedSubscriptionId());
        dto.setRelatedPlanId(notification.getRelatedPlanId());
        return dto;
    }

    private String safePlanName(String planName) {
        return planName != null && !planName.isBlank() ? planName : "subscription";
    }

    private String defaultMessage(String value, String fallback) {
        return value != null && !value.isBlank() ? value : fallback;
    }
}
