package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.CheckInEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CheckInEventRepository extends JpaRepository<CheckInEvent, UUID> {

    Optional<CheckInEvent> findByReservationId(UUID reservationId);
}
