package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.ReservationAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReservationAuditLogRepository extends JpaRepository<ReservationAuditLog, Long> {

    List<ReservationAuditLog> findByReservationIdOrderByPerformedAtDesc(UUID reservationId);
}
