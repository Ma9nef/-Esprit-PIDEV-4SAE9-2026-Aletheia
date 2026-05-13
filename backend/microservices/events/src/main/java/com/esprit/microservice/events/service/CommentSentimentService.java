package com.esprit.microservice.events.service;

import com.esprit.microservice.events.dto.SentimentResponseDTO;
import com.esprit.microservice.events.entity.CommentSentiment;
import com.esprit.microservice.events.entity.EventSentimentStats;
import com.esprit.microservice.events.repository.CommentSentimentRepository;
import com.esprit.microservice.events.repository.EventSentimentStatsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentSentimentService {

    private final CommentSentimentRepository commentSentimentRepository;
    private final EventSentimentStatsRepository eventSentimentStatsRepository;
    private final SentimentAnalysisService sentimentAnalysisService;

    @Transactional
    public CommentSentiment saveCommentWithSentiment(String comment, Long eventId, Long userId, Long processingTimeMs) {
        log.info("Saving comment with sentiment for eventId={}, userId={}", eventId, userId);

        SentimentResponseDTO sentiment;
        try {
            sentiment = sentimentAnalysisService.analyzeComment(comment, eventId, userId);
        } catch (Exception e) {
            log.error("Fallback: sentiment analysis failed", e);
            sentiment = SentimentResponseDTO.builder()
                    .sentiment("NEUTRAL")
                    .confidence(0.5)
                    .positiveScore(0.33)
                    .neutralScore(0.34)
                    .negativeScore(0.33)
                    .processingTimeMs(0L)
                    .build();
        }

        CommentSentiment commentSentiment = CommentSentiment.builder()
                .comment(comment)
                .eventId(eventId)
                .userId(userId)
                .sentiment(sentiment.getSentiment())
                .confidence(sentiment.getConfidence())
                .positiveScore(sentiment.getPositiveScore())
                .neutralScore(sentiment.getNeutralScore())
                .negativeScore(sentiment.getNegativeScore())
                .createdAt(LocalDateTime.now())
                .mlProcessingTimeMs(Double.valueOf(processingTimeMs != null ? processingTimeMs : sentiment.getProcessingTimeMs()))
                .mlModelVersion("camembert-v1.0")
                .isVerified(false)
                .build();

        CommentSentiment saved = commentSentimentRepository.save(commentSentiment);
        updateEventSentimentStats(eventId);

        return saved;
    }

    @Transactional
    public void updateEventSentimentStats(Long eventId) {
        EventSentimentStats stats = eventSentimentStatsRepository.findByEventId(eventId)
                .orElse(EventSentimentStats.builder().eventId(eventId).build());

        List<Object[]> counts = commentSentimentRepository.countBySentimentForEvent(eventId);
        Map<String, Long> countMap = counts.stream()
                .collect(Collectors.toMap(c -> (String) c[0], c -> (Long) c[1]));

        List<CommentSentiment> allComments = commentSentimentRepository.findByEventId(eventId);
        stats.setTotalComments(allComments.size());
        stats.setPositiveCount(countMap.getOrDefault("POSITIVE", 0L).intValue());
        stats.setNeutralCount(countMap.getOrDefault("NEUTRAL", 0L).intValue());
        stats.setNegativeCount(countMap.getOrDefault("NEGATIVE", 0L).intValue());

        Object[] avgScores = commentSentimentRepository.getAverageScoresForEvent(eventId);
        if (avgScores != null && avgScores.length >= 3) {
            stats.setAveragePositiveScore(avgScores[0] != null ? (Double) avgScores[0] : 0.0);
            stats.setAverageNeutralScore(avgScores[1] != null ? (Double) avgScores[1] : 0.0);
            stats.setAverageNegativeScore(avgScores[2] != null ? (Double) avgScores[2] : 0.0);
        }

        double totalWeighted = (stats.getPositiveCount() * 1.0) +
                (stats.getNeutralCount() * 0.5) +
                (stats.getNegativeCount() * 0.0);
        stats.setOverallSentimentScore(stats.getTotalComments() > 0 ? totalWeighted / stats.getTotalComments() : 0.5);

        commentSentimentRepository.findByEventIdOrderByCreatedAtDesc(eventId, PageRequest.of(0, 1))
                .stream().findFirst().ifPresent(last -> {
                    stats.setLastCommentAt(last.getCreatedAt());
                    stats.setLastCommentSentiment(last.getSentiment());
                });

        eventSentimentStatsRepository.save(stats);
    }

    public Page<CommentSentiment> getCommentsByEvent(Long eventId, int page, int size) {
        return commentSentimentRepository.findByEventIdOrderByCreatedAtDesc(eventId, PageRequest.of(page, size));
    }

    public EventSentimentStats getEventStats(Long eventId) {
        return eventSentimentStatsRepository.findByEventId(eventId)
                .orElse(EventSentimentStats.builder().eventId(eventId).build());
    }

    public boolean hasUserCommented(Long eventId, Long userId) {
        return commentSentimentRepository.existsByEventIdAndUserId(eventId, userId);
    }
}