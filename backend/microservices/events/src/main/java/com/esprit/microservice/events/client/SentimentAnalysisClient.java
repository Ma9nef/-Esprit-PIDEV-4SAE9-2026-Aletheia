package com.esprit.microservice.events.client;

import com.esprit.microservice.events.dto.SentimentRequestDTO;
import com.esprit.microservice.events.dto.SentimentResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "sentiment-analysis-service",
        url = "${ml.sentiment.api.url:http://localhost:8005}"
)
public interface SentimentAnalysisClient {

    @PostMapping("/analyze")
    SentimentResponseDTO analyzeSentiment(@RequestBody SentimentRequestDTO request);
}