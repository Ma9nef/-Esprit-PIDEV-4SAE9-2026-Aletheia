package com.esprit.microservice.resourcemanagement.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data @Builder
public class AvailabilityResponse {
    private boolean available;
    private LocalDateTime nextFreeWindow;
    private List<ResourceResponse> availableResources;
    private List<AlternativeSuggestion> suggestions;

    @Data @Builder
    public static class AlternativeSuggestion {
        private ResourceResponse resource;
        private String reason;
        private double score;
    }
}
