package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.MaintenanceWindow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface MaintenanceWindowRepository extends JpaRepository<MaintenanceWindow, UUID> {

    List<MaintenanceWindow> findByResourceIdOrderByStartTimeAsc(UUID resourceId);

    @Query("""
            SELECT m FROM MaintenanceWindow m
            WHERE m.resourceId = :resourceId
              AND m.startTime < :endTime
              AND m.endTime > :startTime
            """)
    List<MaintenanceWindow> findOverlapping(
            @Param("resourceId") UUID resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
