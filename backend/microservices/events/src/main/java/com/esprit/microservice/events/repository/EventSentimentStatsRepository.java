package com.esprit.microservice.events.repository;

import com.esprit.microservice.events.entity.EventSentimentStats;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventSentimentStatsRepository extends JpaRepository<EventSentimentStats, Long> {

    Optional<EventSentimentStats> findByEventId(Long eventId);

    List<EventSentimentStats> findAllByOrderByOverallSentimentScoreDesc(Pageable pageable);

    List<EventSentimentStats> findAllByOrderByTrendingScoreDesc(Pageable pageable);

    @Modifying
    @Query("UPDATE EventSentimentStats e SET e.totalComments = e.totalComments + 1, " +
            "e.lastCommentAt = CURRENT_TIMESTAMP, e.lastUpdatedAt = CURRENT_TIMESTAMP " +
            "WHERE e.eventId = :eventId")
    void incrementCommentCount(@Param("eventId") Long eventId);
}