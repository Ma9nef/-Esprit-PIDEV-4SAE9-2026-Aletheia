package com.example.offer.controller;

import com.example.offer.dto.SubscriptionNotificationResponseDTO;
import com.example.offer.dto.UnreadNotificationCountDTO;
import com.example.offer.service.SubscriptionNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions/notifications")
@RequiredArgsConstructor
public class SubscriptionNotificationController {

    private final SubscriptionNotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SubscriptionNotificationResponseDTO>> getUserNotifications(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<UnreadNotificationCountDTO> getUserUnreadCount(@PathVariable String userId) {
        return ResponseEntity.ok(new UnreadNotificationCountDTO(notificationService.getUserUnreadCount(userId)));
    }

    @PatchMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllUserNotificationsAsRead(@PathVariable String userId) {
        notificationService.markAllUserNotificationsAsRead(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin")
    public ResponseEntity<List<SubscriptionNotificationResponseDTO>> getAdminNotifications() {
        return ResponseEntity.ok(notificationService.getAdminNotifications());
    }

    @GetMapping("/admin/unread-count")
    public ResponseEntity<UnreadNotificationCountDTO> getAdminUnreadCount() {
        return ResponseEntity.ok(new UnreadNotificationCountDTO(notificationService.getAdminUnreadCount()));
    }

    @PatchMapping("/admin/read-all")
    public ResponseEntity<Void> markAllAdminNotificationsAsRead() {
        notificationService.markAllAdminNotificationsAsRead();
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<SubscriptionNotificationResponseDTO> markAsRead(@PathVariable String notificationId) {
        return ResponseEntity.ok(notificationService.markAsRead(notificationId));
    }
}
