package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.WaitlistEntry;
import com.esprit.microservice.resourcemanagement.entity.enums.WaitlistStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface WaitlistEntryRepository extends JpaRepository<WaitlistEntry, UUID> {

    List<WaitlistEntry> findByInstructorIdAndStatusOrderByCreatedAtDesc(String instructorId, WaitlistStatus status);

    List<WaitlistEntry> findByInstructorId(String instructorId);

    @Query("""
            SELECT w FROM WaitlistEntry w
            WHERE w.resourceId = :resourceId
              AND w.status = 'WAITING'
              AND w.startTime = :startTime
              AND w.endTime = :endTime
            ORDER BY w.position ASC
            """)
    List<WaitlistEntry> findWaitingByResourceAndSlot(
            @Param("resourceId") UUID resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query("""
            SELECT COALESCE(MAX(w.position), 0)
            FROM WaitlistEntry w
            WHERE w.resourceId = :resourceId
              AND w.status = 'WAITING'
            """)
    int findMaxPositionForResource(@Param("resourceId") UUID resourceId);

    boolean existsByResourceIdAndInstructorIdAndStatusAndStartTimeAndEndTime(
            UUID resourceId, String instructorId, WaitlistStatus status,
            LocalDateTime startTime, LocalDateTime endTime
    );
}
