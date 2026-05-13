package com.esprit.microservice.events.service;

import com.esprit.microservice.events.client.SentimentAnalysisClient;
import com.esprit.microservice.events.dto.SentimentRequestDTO;
import com.esprit.microservice.events.dto.SentimentResponseDTO;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class SentimentAnalysisService {

    private final SentimentAnalysisClient sentimentClient;
    private final Map<String, SentimentResponseDTO> cache = new ConcurrentHashMap<>();

    @Cacheable(value = "sentimentCache", key = "#comment")
    public SentimentResponseDTO analyzeComment(String comment, Long eventId, Long userId) {
        log.info("Analyzing sentiment for comment: eventId={}, userId={}", eventId, userId);

        String cacheKey = comment.hashCode() + "_" + eventId;
        if (cache.containsKey(cacheKey)) {
            return cache.get(cacheKey);
        }

        try {
            SentimentRequestDTO request = SentimentRequestDTO.builder()
                    .comment(comment)
                    .eventId(eventId)
                    .userId(userId)
                    .build();

            long startTime = System.currentTimeMillis();
            SentimentResponseDTO response = sentimentClient.analyzeSentiment(request);
            response.setProcessingTimeMs(System.currentTimeMillis() - startTime);

            cache.put(cacheKey, response);
            if (cache.size() > 1000) cache.clear();

            return response;
        } catch (FeignException e) {
            log.error("Error calling sentiment API: {}", e.getMessage());
            return SentimentResponseDTO.error();
        }
    }
}