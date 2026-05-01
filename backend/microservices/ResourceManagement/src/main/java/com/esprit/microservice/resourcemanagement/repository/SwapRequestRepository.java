package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.SwapRequest;
import com.esprit.microservice.resourcemanagement.entity.enums.SwapRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface SwapRequestRepository extends JpaRepository<SwapRequest, UUID> {

    @Query("""
            SELECT s FROM SwapRequest s
            WHERE (s.requesterId = :instructorId OR s.targetId = :instructorId)
            ORDER BY s.createdAt DESC
            """)
    List<SwapRequest> findByInstructorId(@Param("instructorId") String instructorId);

    List<SwapRequest> findByStatusAndExpiresAtBefore(SwapRequestStatus status, LocalDateTime time);
}
