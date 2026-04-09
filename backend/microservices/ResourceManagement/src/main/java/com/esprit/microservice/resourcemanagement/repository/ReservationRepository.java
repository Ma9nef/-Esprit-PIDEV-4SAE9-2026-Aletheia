package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    Optional<Reservation> findByIdAndDeletedFalse(UUID id);

    List<Reservation> findByEventIdAndDeletedFalse(String eventId);

    List<Reservation> findByResourceIdAndDeletedFalseOrderByStartTimeAsc(UUID resourceId);

    /**
     * CRITICAL CONFLICT DETECTION QUERY
     *
     * Detects overlapping reservations using the interval overlap formula:
     *   existing.startTime < new.endTime AND existing.endTime > new.startTime
     *
     * Only considers active (non-cancelled, non-deleted) reservations.
     * Uses a native FOR UPDATE (without alias) for MariaDB/MySQL compatibility —
     * Hibernate 7 generates "FOR UPDATE OF alias" in JPQL mode which MariaDB rejects.
     */
    @Query(value = """
            SELECT * FROM reservations
            WHERE resource_id = :resourceId
              AND deleted = false
              AND status <> 'CANCELLED'
              AND start_time < :endTime
              AND end_time > :startTime
            FOR UPDATE
            """, nativeQuery = true)
    List<Reservation> findConflictingReservationsWithLock(
            @Param("resourceId") UUID resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    /**
     * Non-locking version for read-only conflict checks (e.g., availability queries).
     */
    @Query("""
            SELECT r FROM Reservation r
            WHERE r.resourceId = :resourceId
              AND r.deleted = false
              AND r.status <> com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus.CANCELLED
              AND r.startTime < :endTime
              AND r.endTime > :startTime
            """)
    List<Reservation> findConflictingReservations(
            @Param("resourceId") UUID resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    /**
     * Count conflicting reservations — useful for quick boolean availability checks.
     */
    @Query("""
            SELECT COUNT(r) FROM Reservation r
            WHERE r.resourceId = :resourceId
              AND r.deleted = false
              AND r.status <> com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus.CANCELLED
              AND r.startTime < :endTime
              AND r.endTime > :startTime
            """)
    long countConflictingReservations(
            @Param("resourceId") UUID resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}
