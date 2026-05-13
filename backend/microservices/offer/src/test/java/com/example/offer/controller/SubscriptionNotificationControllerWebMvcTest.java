package com.example.offer.controller;

import com.example.offer.dto.SubscriptionNotificationResponseDTO;
import com.example.offer.service.SubscriptionNotificationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = SubscriptionNotificationControllerWebMvcTest.TestConfig.class)
@AutoConfigureMockMvc(addFilters = false)
class SubscriptionNotificationControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SubscriptionNotificationService subscriptionNotificationService;

    @SpringBootConfiguration
    @EnableAutoConfiguration
    @Import(SubscriptionNotificationController.class)
    static class TestConfig {
    }

    @Test
    void getUserUnreadCount_shouldExposeCountDto() throws Exception {
        when(subscriptionNotificationService.getUserUnreadCount("user-1")).thenReturn(3L);

        mockMvc.perform(get("/api/subscriptions/notifications/user/user-1/unread-count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unreadCount").value(3));
    }

    @Test
    void markAllUserNotificationsAsRead_shouldReturnNoContent() throws Exception {
        mockMvc.perform(patch("/api/subscriptions/notifications/user/user-1/read-all"))
                .andExpect(status().isNoContent());

        verify(subscriptionNotificationService).markAllUserNotificationsAsRead("user-1");
    }

    @Test
    void markAsRead_shouldReturnUpdatedNotification() throws Exception {
        SubscriptionNotificationResponseDTO notification = new SubscriptionNotificationResponseDTO();
        notification.setNotificationId("notif-1");
        notification.setType("PAYMENT_FAILED");
        notification.setRead(true);

        when(subscriptionNotificationService.markAsRead("notif-1")).thenReturn(notification);

        mockMvc.perform(patch("/api/subscriptions/notifications/notif-1/read"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.notificationId").value("notif-1"))
                .andExpect(jsonPath("$.type").value("PAYMENT_FAILED"))
                .andExpect(jsonPath("$.read").value(true));
    }

    @Test
    void getAdminNotifications_shouldReturnNotificationList() throws Exception {
        SubscriptionNotificationResponseDTO notification = new SubscriptionNotificationResponseDTO();
        notification.setNotificationId("notif-1");
        notification.setType("EXPIRING_SOON");
        notification.setTitle("Admin alert");

        when(subscriptionNotificationService.getAdminNotifications()).thenReturn(List.of(notification));

        mockMvc.perform(get("/api/subscriptions/notifications/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].notificationId").value("notif-1"))
                .andExpect(jsonPath("$[0].type").value("EXPIRING_SOON"))
                .andExpect(jsonPath("$[0].title").value("Admin alert"));
    }
}
