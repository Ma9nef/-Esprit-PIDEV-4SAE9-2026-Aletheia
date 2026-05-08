package com.esprit.microservice.events.dto;

import com.esprit.microservice.events.controller.CommentSentimentController.EventStatsResponse;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class EventSentimentShareResponse {
    private String shareUrl;
    private String shareToken;
    private Long eventId;
    private EventStatsResponse stats;
    private List<CommentShareResponse> comments;
    private LocalDateTime generatedAt;
    private LocalDateTime expiresAt;

    public Integer getTotalComments() {
        return comments != null ? comments.size() : 0;
    }

    public Double getAverageSentiment() {
        if (comments == null || comments.isEmpty()) return 0.0;
        return comments.stream()
                .mapToDouble(c -> {
                    if (c.getSentiment() == null) return 0.5;
                    switch(c.getSentiment().toUpperCase()) {
                        case "POSITIVE": return 1.0;
                        case "NEUTRAL": return 0.5;
                        case "NEGATIVE": return 0.0;
                        default: return 0.5;
                    }
                })
                .average()
                .orElse(0.5);
    }

    public String getSummary() {
        int total = getTotalComments();
        if (total == 0) return "Aucun commentaire pour le moment";
        double avg = getAverageSentiment();
        if (avg >= 0.7) return "Très bien accueilli par les participants";
        if (avg >= 0.55) return "Bien accueilli par les participants";
        if (avg >= 0.45) return "Accueil mitigé";
        return "Accueil plutôt négatif";
    }
}