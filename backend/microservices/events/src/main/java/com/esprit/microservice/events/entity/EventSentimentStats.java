package com.esprit.microservice.events.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_sentiment_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventSentimentStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long eventId;

    private Integer totalComments = 0;
    private Integer positiveCount = 0;
    private Integer neutralCount = 0;
    private Integer negativeCount = 0;

    private Double averagePositiveScore = 0.0;
    private Double averageNeutralScore = 0.0;
    private Double averageNegativeScore = 0.0;
    private Double overallSentimentScore = 0.5;

    private LocalDateTime lastCommentAt;
    private String lastCommentSentiment;
    private Integer trendingScore = 0;
    private LocalDateTime lastUpdatedAt;

    @PreUpdate
    @PrePersist
    protected void onUpdate() {
        lastUpdatedAt = LocalDateTime.now();
    }
}