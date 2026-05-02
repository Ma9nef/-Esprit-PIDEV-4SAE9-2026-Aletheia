package com.esprit.microservice.library.client;

import com.esprit.microservice.library.dto.NotificationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 * HTTP client for the Notification microservice internal endpoint.
 * Uses a direct URL (no Eureka) with a shared X-Internal-Secret header.
 */
@Component
public class NotificationServiceClient {

    private static final Logger log = LoggerFactory.getLogger(NotificationServiceClient.class);

    private final RestTemplate restTemplate;

    @Value("${notification.service.url:http://localhost:8083}")
    private String notificationServiceUrl;

    @Value("${notification.internal-secret}")
    private String internalSecret;

    public NotificationServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Sends a notification to the Notification microservice.
     * Never throws — any failure is logged and swallowed so the caller's transaction is never rolled back.
     */
    public void send(NotificationRequest request) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Internal-Secret", internalSecret);

            HttpEntity<NotificationRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    notificationServiceUrl + "/api/notifications/internal/send",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Notification sent successfully: title='{}' → userId={}", request.getTitle(), request.getRecipientId());
            } else {
                log.warn("Notification service returned {}: {}", response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            log.warn("Failed to send notification (title='{}', userId={}): {}",
                    request.getTitle(), request.getRecipientId(), e.getMessage());
        }
    }
}
