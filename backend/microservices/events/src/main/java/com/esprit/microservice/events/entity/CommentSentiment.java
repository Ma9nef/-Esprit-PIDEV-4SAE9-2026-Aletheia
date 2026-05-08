package com.esprit.microservice.events.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name = "comment_sentiments",
        indexes = {
                @Index(name = "idx_event_id", columnList = "eventId"),    // ← snake_case changé en camelCase
                @Index(name = "idx_user_id", columnList = "userId"),
                @Index(name = "idx_sentiment", columnList = "sentiment"),
                @Index(name = "idx_created_at", columnList = "createdAt")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentSentiment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private Long eventId;      // ← Le champ reste eventId

    @Column(nullable = false)
    private Long userId;       // ← Le champ reste userId

    @Column(nullable = false, length = 20)
    private String sentiment;

    @Column(nullable = false)
    private Double confidence;

    private Double positiveScore;
    private Double neutralScore;
    private Double negativeScore;

    @Column(nullable = false)
    private LocalDateTime createdAt;  // ← Le champ reste createdAt

    private Boolean isVerified;
    private Long verifiedBy;
    private Double mlProcessingTimeMs;
    private String mlModelVersion;
}