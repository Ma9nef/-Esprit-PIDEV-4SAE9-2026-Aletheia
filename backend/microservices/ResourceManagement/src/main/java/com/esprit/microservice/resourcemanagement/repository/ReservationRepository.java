package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.Reservation;
import com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    Optional<Reservation> findByIdAndDeletedFalse(UUID id);

    List<Reservation> findByInstructorIdAndDeletedFalse(String instructorId);

    List<Reservation> findByRecurrenceGroupIdAndDeletedFalse(UUID recurrenceGroupId);

    Optional<Reservation> findByQrCodeTokenAndDeletedFalse(String qrCodeToken);

    @Query("""
            SELECT r FROM Reservation r
            WHERE r.resource.id = :resourceId
              AND r.deleted = false
              AND r.status NOT IN ('CANCELLED', 'REJECTED')
              AND r.startTime < :endTime
              AND r.endTime > :startTime
            """)
    List<Reservation> findConflictingReservations(
            @Param("resourceId") UUID resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    // Native query avoids Hibernate 7's "FOR UPDATE OF alias" syntax which MariaDB rejects.
    @Query(value = """
            SELECT r.* FROM reservations r
            WHERE r.resource_id = :resourceId
              AND r.deleted = false
              AND r.status NOT IN ('CANCELLED', 'REJECTED')
              AND r.start_time < :endTime
              AND r.end_time > :startTime
            FOR UPDATE
            """, nativeQuery = true)
    List<Reservation> findConflictingReservationsWithLock(
            @Param("resourceId") UUID resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query("""
            SELECT r FROM Reservation r
            WHERE r.status = 'CONFIRMED'
              AND r.deleted = false
              AND r.noShow = false
              AND r.checkedInAt IS NULL
              AND r.startTime <= :cutoff
            """)
    List<Reservation> findConfirmedWithoutCheckIn(@Param("cutoff") LocalDateTime cutoff);

    @Query("""
            SELECT r FROM Reservation r
            WHERE r.status = 'PENDING'
              AND r.deleted = false
              AND r.expiresAt < :now
            """)
    List<Reservation> findExpiredPendingReservations(@Param("now") LocalDateTime now);

    @Query("""
            SELECT r FROM Reservation r
            WHERE r.instructorId = :instructorId
              AND r.deleted = false
              AND r.status NOT IN ('CANCELLED', 'REJECTED')
              AND r.startTime < :endTime
              AND r.endTime > :startTime
            """)
    List<Reservation> findActiveByInstructorAndTimeRange(
            @Param("instructorId") String instructorId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    // Statistics queries
    @Query("""
            SELECT r.status, COUNT(r) FROM Reservation r
            WHERE r.resource.id = :resourceId
              AND r.deleted = false
              AND r.startTime >= :from
              AND r.endTime <= :to
            GROUP BY r.status
            """)
    List<Object[]> countByStatusForResource(
            @Param("resourceId") UUID resourceId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    @Query("""
            SELECT SUM(FUNCTION('TIMESTAMPDIFF', HOUR, r.startTime, r.endTime))
            FROM Reservation r
            WHERE r.resource.id = :resourceId
              AND r.status = 'CONFIRMED'
              AND r.deleted = false
              AND r.startTime >= :from
              AND r.endTime <= :to
            """)
    Long totalConfirmedHours(
            @Param("resourceId") UUID resourceId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    List<Reservation> findByStatusAndDeletedFalse(ReservationStatus status);

    @Query("""
            SELECT r FROM Reservation r
            WHERE r.instructorId <> :excludeInstructorId
              AND r.deleted = false
              AND r.status = 'CONFIRMED'
              AND r.endTime > :now
            ORDER BY r.startTime ASC
            """)
    List<Reservation> findSwappableReservations(
            @Param("excludeInstructorId") String excludeInstructorId,
            @Param("now") LocalDateTime now
    );
}
