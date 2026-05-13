package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.ResourceAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ResourceAvailabilityRepository extends JpaRepository<ResourceAvailability, Long> {

    List<ResourceAvailability> findByResourceIdOrderByStartTimeAsc(UUID resourceId);

    @Query("""
            SELECT ra FROM ResourceAvailability ra
            WHERE ra.resourceId = :resourceId
              AND ra.startTime < :endTime
              AND ra.endTime > :startTime
            ORDER BY ra.startTime ASC
            """)
    List<ResourceAvailability> findOverlapping(
            @Param("resourceId") UUID resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}
