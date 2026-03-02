package tn.esprit.microservice.aletheia.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.microservice.aletheia.entity.EventResourceAllocation;

import java.time.LocalDateTime;
import java.util.List;

public interface EventResourceAllocationRepository extends JpaRepository<EventResourceAllocation, Long> {

    List<EventResourceAllocation> findByEventId(Long eventId);

    List<EventResourceAllocation> findByResourceId(Long resourceId);

    @Query("SELECT era FROM EventResourceAllocation era WHERE era.resource.id = :resourceId " +
            "AND era.startTime <= :endTime AND era.endTime >= :startTime")
    List<EventResourceAllocation> findConflictingAllocations(
            @Param("resourceId") Long resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    @Query("SELECT SUM(era.quantityUsed) FROM EventResourceAllocation era " +
            "WHERE era.resource.id = :resourceId AND era.startTime >= :startDate")
    Integer getTotalResourceUsage(
            @Param("resourceId") Long resourceId,
            @Param("startDate") LocalDateTime startDate);
}