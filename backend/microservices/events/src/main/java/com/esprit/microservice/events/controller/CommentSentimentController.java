package com.esprit.microservice.events.controller;

import com.esprit.microservice.events.dto.CommentShareResponse;
import com.esprit.microservice.events.dto.EventSentimentShareResponse;
import com.esprit.microservice.events.entity.CommentSentiment;
import com.esprit.microservice.events.entity.EventSentimentStats;
import com.esprit.microservice.events.repository.CommentSentimentRepository;
import com.esprit.microservice.events.service.CommentSentimentService;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events/sentiments")
@RequiredArgsConstructor
@CrossOrigin("*")
@Slf4j
public class CommentSentimentController {

    // Constantes ajoutées pour résoudre les duplications
    private static final String ERROR_MSG = "error";
    private static final String NEUTRE_MSG = "Neutre";
    private static final String STATUS_KEY = "status";
    private static final String MESSAGE_KEY = "message";

    private final CommentSentimentService commentSentimentService;
    private final CommentSentimentRepository commentSentimentRepository;

    @PostMapping("/comment")
    public ResponseEntity<CommentWithSentimentResponse> addCommentWithSentiment(
            @Valid @RequestBody AddCommentRequest request) {

        long startTime = System.currentTimeMillis();

        CommentSentiment saved = commentSentimentService.saveCommentWithSentiment(
                request.getComment(),
                request.getEventId(),
                request.getUserId(),
                System.currentTimeMillis() - startTime
        );

        return ResponseEntity.ok(CommentWithSentimentResponse.fromEntity(saved));
    }

    @GetMapping("/event/{eventId}/comments")
    public ResponseEntity<EventCommentsResponse> getEventComments(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<CommentSentiment> commentsPage = commentSentimentService.getCommentsByEvent(eventId, page, size);
        EventSentimentStats stats = commentSentimentService.getEventStats(eventId);

        EventCommentsResponse response = EventCommentsResponse.builder()
                .eventId(eventId)
                .stats(EventStatsResponse.fromEntity(stats))
                .comments(commentsPage.getContent().stream()
                        .map(CommentResponse::fromEntity)
                        .collect(Collectors.toList()))
                .currentPage(commentsPage.getNumber())
                .totalPages(commentsPage.getTotalPages())
                .totalComments(commentsPage.getTotalElements())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/event/{eventId}/stats")
    public ResponseEntity<EventStatsResponse> getEventStats(@PathVariable Long eventId) {
        EventSentimentStats stats = commentSentimentService.getEventStats(eventId);
        return ResponseEntity.ok(EventStatsResponse.fromEntity(stats));
    }

    @GetMapping("/event/{eventId}/user/{userId}/has-commented")
    public ResponseEntity<Map<String, Boolean>> hasUserCommented(
            @PathVariable Long eventId,
            @PathVariable Long userId) {

        boolean hasCommented = commentSentimentService.hasUserCommented(eventId, userId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("hasCommented", hasCommented);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/event/{eventId}/share")
    public ResponseEntity<Object> getEventSentimentForSharing(
            @PathVariable Long eventId,
            @RequestParam(defaultValue = "true") boolean includeComments) {

        try {
            log.info("🔗 Génération du lien de partage pour l'événement: {}", eventId);

            EventSentimentStats stats = commentSentimentService.getEventStats(eventId);
            List<CommentSentiment> comments = includeComments ?
                    commentSentimentRepository.findByEventId(eventId) :
                    new ArrayList<>();

            String shareToken = generateShareToken(eventId);

            EventSentimentShareResponse response = EventSentimentShareResponse.builder()
                    .shareUrl("http://localhost:4200/events/sentiments/share/" + shareToken)
                    .shareToken(shareToken)
                    .eventId(eventId)
                    .stats(EventStatsResponse.fromEntity(stats))
                    .comments(comments.stream()
                            .map(CommentShareResponse::fromEntity)
                            .collect(Collectors.toList()))
                    .generatedAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusDays(7))
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Erreur lors de la génération du lien de partage: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put(ERROR_MSG, "Impossible de générer le lien de partage");
            error.put(MESSAGE_KEY, e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/share/{token}")
    public ResponseEntity<Object> getSharedEventSentiment(@PathVariable String token) {

        try {
            log.info("🔗 Accès au lien de partage avec token: {}", token);

            Long eventId = validateShareToken(token);
            if (eventId == null) {
                Map<String, String> error = new HashMap<>();
                error.put(ERROR_MSG, "Token invalide ou expiré");
                return ResponseEntity.badRequest().body(error);
            }

            EventSentimentStats stats = commentSentimentService.getEventStats(eventId);
            List<CommentSentiment> comments = commentSentimentRepository.findByEventId(eventId);

            EventSentimentShareResponse response = EventSentimentShareResponse.builder()
                    .shareUrl("http://localhost:4200/events/sentiments/share/" + token)
                    .shareToken(token)
                    .eventId(eventId)
                    .stats(EventStatsResponse.fromEntity(stats))
                    .comments(comments.stream()
                            .map(CommentShareResponse::fromEntity)
                            .collect(Collectors.toList()))
                    .generatedAt(LocalDateTime.now())
                    .expiresAt(LocalDateTime.now().plusDays(7))
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Erreur lors de l'accès au lien partagé: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put(ERROR_MSG, "Impossible d'accéder au contenu partagé");
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/event/{eventId}/share-stats")
    public ResponseEntity<Object> getSimpleShareStats(@PathVariable Long eventId) {

        try {
            EventSentimentStats stats = commentSentimentService.getEventStats(eventId);

            Map<String, Object> simpleStats = new HashMap<>();
            simpleStats.put("eventId", eventId);
            simpleStats.put("totalComments", stats.getTotalComments());
            simpleStats.put("positiveCount", stats.getPositiveCount());
            simpleStats.put("neutralCount", stats.getNeutralCount());
            simpleStats.put("negativeCount", stats.getNegativeCount());
            simpleStats.put("positivePercentage", stats.getTotalComments() > 0 ?
                    stats.getPositiveCount() * 100.0 / stats.getTotalComments() : 0);
            simpleStats.put("neutralPercentage", stats.getTotalComments() > 0 ?
                    stats.getNeutralCount() * 100.0 / stats.getTotalComments() : 0);
            simpleStats.put("negativePercentage", stats.getTotalComments() > 0 ?
                    stats.getNegativeCount() * 100.0 / stats.getTotalComments() : 0);
            simpleStats.put("overallScore", stats.getOverallSentimentScore());
            simpleStats.put("sentimentLabel", getSentimentLabel(stats.getOverallSentimentScore()));
            simpleStats.put("shareableLink", "http://localhost:8090/api/events/sentiments/event/" + eventId + "/share");

            return ResponseEntity.ok(simpleStats);

        } catch (Exception e) {
            log.error("Erreur: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put(ERROR_MSG, e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    // ==================== METHODES PRIVEES ====================

    private String generateShareToken(Long eventId) {
        String raw = eventId + ":" + System.currentTimeMillis() + ":" + UUID.randomUUID().toString();
        return Base64.getUrlEncoder().withoutPadding().encodeToString(raw.getBytes());
    }

    private Long validateShareToken(String token) {
        try {
            String decoded = new String(Base64.getUrlDecoder().decode(token));
            String[] parts = decoded.split(":");
            if (parts.length >= 1) {
                return Long.parseLong(parts[0]);
            }
        } catch (Exception e) {
            log.error("Invalid share token: {}", token, e);
        }
        return null;
    }

    private String getSentimentLabel(Double score) {
        if (score == null) return NEUTRE_MSG;
        if (score >= 0.7) return "Très positif";
        if (score >= 0.55) return "Positif";
        if (score >= 0.45) return NEUTRE_MSG;
        if (score >= 0.3) return "Négatif";
        return "Très négatif";
    }

    // ==================== DTOS INTERNES ====================

    @Data
    public static class AddCommentRequest {
        @NotBlank private String comment;
        @NotNull private Long eventId;
        @NotNull private Long userId;
    }

    @Data @Builder
    public static class CommentWithSentimentResponse {
        private Long id;
        private String comment;
        private Long eventId;
        private Long userId;
        private String sentiment;
        private Double confidence;
        private Double positiveScore;
        private Double neutralScore;
        private Double negativeScore;
        private LocalDateTime createdAt;

        public static CommentWithSentimentResponse fromEntity(CommentSentiment entity) {
            return CommentWithSentimentResponse.builder()
                    .id(entity.getId())
                    .comment(entity.getComment())
                    .eventId(entity.getEventId())
                    .userId(entity.getUserId())
                    .sentiment(entity.getSentiment())
                    .confidence(entity.getConfidence())
                    .positiveScore(entity.getPositiveScore())
                    .neutralScore(entity.getNeutralScore())
                    .negativeScore(entity.getNegativeScore())
                    .createdAt(entity.getCreatedAt())
                    .build();
        }
    }

    @Data @Builder
    public static class CommentResponse {
        private Long id;
        private String comment;
        private Long userId;
        private String sentiment;
        private Double confidence;
        private LocalDateTime createdAt;

        public static CommentResponse fromEntity(CommentSentiment entity) {
            return CommentResponse.builder()
                    .id(entity.getId())
                    .comment(entity.getComment())
                    .userId(entity.getUserId())
                    .sentiment(entity.getSentiment())
                    .confidence(entity.getConfidence())
                    .createdAt(entity.getCreatedAt())
                    .build();
        }
    }

    @Data @Builder
    public static class EventStatsResponse {
        private Long eventId;
        private Integer totalComments;
        private Integer positiveCount;
        private Integer neutralCount;
        private Integer negativeCount;
        private Double positivePercentage;
        private Double neutralPercentage;
        private Double negativePercentage;
        private Double overallSentimentScore;
        private String sentimentLabel;

        public static EventStatsResponse fromEntity(EventSentimentStats entity) {
            int total = entity.getTotalComments();
            return EventStatsResponse.builder()
                    .eventId(entity.getEventId())
                    .totalComments(total)
                    .positiveCount(entity.getPositiveCount())
                    .neutralCount(entity.getNeutralCount())
                    .negativeCount(entity.getNegativeCount())
                    .positivePercentage(total > 0 ? entity.getPositiveCount() * 100.0 / total : 0)
                    .neutralPercentage(total > 0 ? entity.getNeutralCount() * 100.0 / total : 0)
                    .negativePercentage(total > 0 ? entity.getNegativeCount() * 100.0 / total : 0)
                    .overallSentimentScore(entity.getOverallSentimentScore())
                    .sentimentLabel(getSentimentLabelStatic(entity.getOverallSentimentScore()))
                    .build();
        }

        private static String getSentimentLabelStatic(Double score) {
            if (score == null) return "Neutre";
            if (score >= 0.7) return "Très positif";
            if (score >= 0.55) return "Positif";
            if (score >= 0.45) return "Neutre";
            if (score >= 0.3) return "Négatif";
            return "Très négatif";
        }
    }

    @Data @Builder
    public static class EventCommentsResponse {
        private Long eventId;
        private EventStatsResponse stats;
        private List<CommentResponse> comments;
        private int currentPage;
        private int totalPages;
        private long totalComments;
    }
}