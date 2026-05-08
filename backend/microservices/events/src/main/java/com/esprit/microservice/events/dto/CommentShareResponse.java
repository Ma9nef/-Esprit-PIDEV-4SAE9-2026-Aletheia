package com.esprit.microservice.events.dto;

import com.esprit.microservice.events.entity.CommentSentiment;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentShareResponse {
    private Long id;
    private String comment;
    private String sentiment;
    private Double confidence;
    private String createdAt;
    private String anonymousUserId;

    public static CommentShareResponse fromEntity(CommentSentiment entity) {
        if (entity == null) return null;

        return CommentShareResponse.builder()
                .id(entity.getId())
                .comment(entity.getComment())
                .sentiment(entity.getSentiment() != null ? entity.getSentiment() : "NEUTRAL")
                .confidence(entity.getConfidence() != null ? entity.getConfidence() : 0.5)
                .createdAt(entity.getCreatedAt() != null ? entity.getCreatedAt().toString() : null)
                .anonymousUserId("User_" + (entity.getUserId() != null ? entity.getUserId() : 0))
                .build();
    }
}