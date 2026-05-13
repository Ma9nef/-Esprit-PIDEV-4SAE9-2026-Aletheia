package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.formations.FormationAttendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FormationAttendanceRepository extends JpaRepository<FormationAttendance, Long> {

    Optional<FormationAttendance> findByFormationSession_IdAndUserId(Long sessionId, Long userId);

    List<FormationAttendance> findByFormationSession_Id(Long sessionId);

    List<FormationAttendance> findByFormationSession_Formation_IdAndUserIdOrderByFormationSession_SessionDateAsc(
            Long formationId,
            Long userId
    );
}