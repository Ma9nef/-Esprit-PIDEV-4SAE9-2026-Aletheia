package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.Resource;
import com.esprit.microservice.resourcemanagement.entity.enums.MaintenanceStatus;
import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ResourceRepository extends JpaRepository<Resource, UUID> {

    Optional<Resource> findByIdAndDeletedFalse(UUID id);

    List<Resource> findByDeletedFalse();

    List<Resource> findByTypeAndDeletedFalse(ResourceType type);

    List<Resource> findByTypeAndMaintenanceStatusAndDeletedFalse(ResourceType type, MaintenanceStatus status);

    @Query("""
            SELECT r FROM Resource r
            WHERE r.deleted = false
              AND r.maintenanceStatus = 'OPERATIONAL'
              AND (:type IS NULL OR r.type = :type)
              AND (:minCapacity IS NULL OR r.capacity >= :minCapacity)
              AND (:location IS NULL OR r.location LIKE %:location%)
              AND r.id NOT IN (
                  SELECT res.resource.id FROM Reservation res
                  WHERE res.deleted = false
                    AND res.status NOT IN ('CANCELLED', 'REJECTED')
                    AND res.startTime < :endTime
                    AND res.endTime > :startTime
              )
            ORDER BY r.name
            """)
    List<Resource> findAvailableResources(
            @Param("type") ResourceType type,
            @Param("minCapacity") Integer minCapacity,
            @Param("location") String location,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query("""
            SELECT r FROM Resource r
            WHERE r.deleted = false
              AND r.maintenanceStatus = 'OPERATIONAL'
              AND r.type = :type
              AND (:minCapacity IS NULL OR r.capacity >= :minCapacity)
              AND r.id NOT IN (
                  SELECT res.resource.id FROM Reservation res
                  WHERE res.deleted = false
                    AND res.status NOT IN ('CANCELLED', 'REJECTED')
                    AND res.startTime < :endTime
                    AND res.endTime > :startTime
              )
            ORDER BY r.conditionScore DESC
            """)
    List<Resource> findAlternatives(
            @Param("type") ResourceType type,
            @Param("minCapacity") Integer minCapacity,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
