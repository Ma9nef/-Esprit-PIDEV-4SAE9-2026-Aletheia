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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SubscriptionNotificationServiceTest {

    @Mock
    private SubscriptionNotificationRepository notificationRepository;

    @Mock
    private SubscriptionRepository subscriptionRepository;

    @Mock
    private SubscriptionPlanRepository subscriptionPlanRepository;

    @InjectMocks
    private SubscriptionNotificationService subscriptionNotificationService;

    @Test
    void markAsRead_shouldPersistUnreadNotification() {
        SubscriptionNotification notification = new SubscriptionNotification();
        notification.setId("notif-1");
        notification.setRead(false);
        notification.setRecipientType(NotificationRecipientType.USER);
        notification.setRecipientId("user-1");
        notification.setType(SubscriptionNotificationType.PAYMENT_FAILED);
        notification.setTitle("Payment failed");
        notification.setMessage("message");

        when(notificationRepository.findById("notif-1")).thenReturn(Optional.of(notification));

        SubscriptionNotificationResponseDTO response = subscriptionNotificationService.markAsRead("notif-1");

        assertTrue(response.isRead());
        assertNotNull(response.getReadAt());
        verify(notificationRepository).save(notification);
    }

    @Test
    void markAsRead_shouldNotSaveAlreadyReadNotification() {
        SubscriptionNotification notification = new SubscriptionNotification();
        notification.setId("notif-1");
        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now().minusHours(1));

        when(notificationRepository.findById("notif-1")).thenReturn(Optional.of(notification));

        subscriptionNotificationService.markAsRead("notif-1");

        verify(notificationRepository, never()).save(any());
    }

    @Test
    void markAllUserNotificationsAsRead_shouldUpdateEveryUnreadNotification() {
        SubscriptionNotification first = new SubscriptionNotification();
        first.setId("n1");
        first.setRead(false);
        SubscriptionNotification second = new SubscriptionNotification();
        second.setId("n2");
        second.setRead(false);

        when(notificationRepository.findByRecipientTypeAndRecipientIdAndReadFalse(NotificationRecipientType.USER, "user-1"))
                .thenReturn(List.of(first, second));

        subscriptionNotificationService.markAllUserNotificationsAsRead("user-1");

        assertTrue(first.isRead());
        assertTrue(second.isRead());
        assertNotNull(first.getReadAt());
        assertNotNull(second.getReadAt());
        verify(notificationRepository).saveAll(List.of(first, second));
    }

    @Test
    void notifySubscriptionExpired_shouldCreateUserAndAdminNotificationsWithDeduplication() {
        Subscription subscription = new Subscription();
        subscription.setId("sub-1");
        subscription.setUserId("user-1");
        subscription.setPlanId("plan-1");
        subscription.setSubscriptionNumber("SUB-1");

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setName("Premium");

        when(notificationRepository.findByDeduplicationKey("expired:sub-1:user:user-1")).thenReturn(Optional.empty());
        when(notificationRepository.findByDeduplicationKey("expired:sub-1:admin")).thenReturn(Optional.empty());

        subscriptionNotificationService.notifySubscriptionExpired(subscription, plan);

        ArgumentCaptor<SubscriptionNotification> captor = ArgumentCaptor.forClass(SubscriptionNotification.class);
        verify(notificationRepository, times(2)).save(captor.capture());

        List<SubscriptionNotification> savedNotifications = captor.getAllValues();
        SubscriptionNotification userNotification = savedNotifications.get(0);
        SubscriptionNotification adminNotification = savedNotifications.get(1);

        assertEquals(NotificationRecipientType.USER, userNotification.getRecipientType());
        assertEquals("user-1", userNotification.getRecipientId());
        assertEquals(SubscriptionNotificationType.SUBSCRIPTION_EXPIRED, userNotification.getType());
        assertEquals("expired:sub-1:user:user-1", userNotification.getDeduplicationKey());
        assertTrue(userNotification.getMessage().contains("Premium"));

        assertEquals(NotificationRecipientType.ADMIN, adminNotification.getRecipientType());
        assertNull(adminNotification.getRecipientId());
        assertEquals("expired:sub-1:admin", adminNotification.getDeduplicationKey());
    }

    @Test
    void createExpirationReminders_shouldSkipSubscriptionWithoutEndDate() {
        Subscription subscription = new Subscription();
        subscription.setId("sub-1");
        subscription.setUserId("user-1");
        subscription.setPlanId("plan-1");
        subscription.setSubscriptionNumber("SUB-1");
        subscription.setEndDate(null);

        when(subscriptionRepository.findByStatusAndEndDateBetween(any(), any(), any()))
                .thenReturn(List.of(subscription));

        subscriptionNotificationService.createExpirationReminders();

        verify(notificationRepository, never()).save(any());
    }

    @Test
    void createExpirationReminders_shouldAvoidDuplicateNotifications() {
        Subscription subscription = new Subscription();
        subscription.setId("sub-1");
        subscription.setUserId("user-1");
        subscription.setPlanId("plan-1");
        subscription.setSubscriptionNumber("SUB-1");
        subscription.setEndDate(LocalDateTime.now().plusDays(2));

        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setId("plan-1");
        plan.setName("Premium");

        when(subscriptionRepository.findByStatusAndEndDateBetween(any(), any(), any()))
                .thenReturn(List.of(subscription));
        when(subscriptionPlanRepository.findById("plan-1")).thenReturn(Optional.of(plan));
        when(notificationRepository.findByDeduplicationKey("expiring:sub-1:3:user:user-1"))
                .thenReturn(Optional.of(new SubscriptionNotification()));
        when(notificationRepository.findByDeduplicationKey("expiring:sub-1:3:admin"))
                .thenReturn(Optional.empty());

        subscriptionNotificationService.createExpirationReminders();

        ArgumentCaptor<SubscriptionNotification> captor = ArgumentCaptor.forClass(SubscriptionNotification.class);
        verify(notificationRepository, times(1)).save(captor.capture());
        assertEquals(NotificationRecipientType.ADMIN, captor.getValue().getRecipientType());
        assertEquals("expiring:sub-1:3:admin", captor.getValue().getDeduplicationKey());
    }

    @Test
    void getUserUnreadCount_shouldDelegateToRepository() {
        when(notificationRepository.countByRecipientTypeAndRecipientIdAndReadFalse(NotificationRecipientType.USER, "user-1"))
                .thenReturn(4L);

        long unreadCount = subscriptionNotificationService.getUserUnreadCount("user-1");

        assertEquals(4L, unreadCount);
    }
}
