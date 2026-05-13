// ShareService.java
package com.esprit.microservice.events.service;

import lombok.Builder;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.time.LocalDateTime;

@Service
public class ShareService {

    private final Map<String, ShareInfo> shareTokens = new ConcurrentHashMap<>();

    public String createShareLink(Long eventId, int daysValid) {
        String token = UUID.randomUUID().toString();
        shareTokens.put(token, ShareInfo.builder()
                .eventId(eventId)
                .expiresAt(LocalDateTime.now().plusDays(daysValid))
                .createdAt(LocalDateTime.now())
                .build());
        return token;
    }

    public Long getEventIdFromToken(String token) {
        ShareInfo info = shareTokens.get(token);
        if (info != null && info.getExpiresAt().isAfter(LocalDateTime.now())) {
            return info.getEventId();
        }
        shareTokens.remove(token);
        return null;
    }

    @Data
    @Builder
    private static class ShareInfo {
        private Long eventId;
        private LocalDateTime expiresAt;
        private LocalDateTime createdAt;
    }
}