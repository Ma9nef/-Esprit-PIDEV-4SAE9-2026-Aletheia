package com.esprit.microservice.events.repository;

import com.esprit.microservice.events.entity.CommentSentiment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommentSentimentRepository extends JpaRepository<CommentSentiment, Long> {

    Page<CommentSentiment> findByEventIdOrderByCreatedAtDesc(Long eventId, Pageable pageable);

    List<CommentSentiment> findByEventId(Long eventId);

    List<CommentSentiment> findByEventIdAndSentiment(Long eventId, String sentiment);

    Page<CommentSentiment> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    @Query("SELECT c.sentiment, COUNT(c) FROM CommentSentiment c WHERE c.eventId = :eventId GROUP BY c.sentiment")
    List<Object[]> countBySentimentForEvent(@Param("eventId") Long eventId);

    @Query("SELECT AVG(c.positiveScore), AVG(c.neutralScore), AVG(c.negativeScore) FROM CommentSentiment c WHERE c.eventId = :eventId")
    Object[] getAverageScoresForEvent(@Param("eventId") Long eventId);

    boolean existsByEventIdAndUserId(Long eventId, Long userId);

    Optional<CommentSentiment> findFirstByEventIdAndUserIdOrderByCreatedAtDesc(Long eventId, Long userId);

    long countByEventId(Long eventId);
}