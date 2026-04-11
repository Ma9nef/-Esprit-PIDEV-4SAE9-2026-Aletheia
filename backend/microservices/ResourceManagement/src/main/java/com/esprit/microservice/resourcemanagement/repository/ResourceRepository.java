package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.Resource;
import com.esprit.microservice.resourcemanagement.entity.enums.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, UUID> {

    Optional<Resource> findByIdAndDeletedFalse(UUID id);

    List<Resource> findAllByDeletedFalse();

    List<Resource> findAllByTypeAndDeletedFalse(ResourceType type);

    /**
     * Find resources of a given type that have NO conflicting reservations
     * in the specified time range (i.e., they are available).
     */
    @Query("""
            SELECT r FROM Resource r
            WHERE r.deleted = false
              AND r.type = :type
              AND r.id NOT IN (
                  SELECT res.resourceId FROM Reservation res
                  WHERE res.deleted = false
                    AND res.status <> com.esprit.microservice.resourcemanagement.entity.enums.ReservationStatus.CANCELLED
                    AND res.startTime < :endTime
                    AND res.endTime > :startTime
              )
            """)
    List<Resource> findAvailableByType(
            @Param("type") ResourceType type,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
}
