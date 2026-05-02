package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.ReservationAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReservationAuditLogRepository extends JpaRepository<ReservationAuditLog, UUID> {

    List<ReservationAuditLog> findByReservationIdOrderByTimestampAsc(UUID reservationId);
}
