package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.formations.FormationSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FormationSessionRepository extends JpaRepository<FormationSession, Long> {

    List<FormationSession> findByFormation_IdOrderBySessionDateAscStartTimeAsc(Long formationId);

    List<FormationSession> findByFormation_InstructorIdOrderBySessionDateAscStartTimeAsc(Long instructorId);

    List<FormationSession> findByFormation_IdAndSessionDateGreaterThanEqualOrderBySessionDateAscStartTimeAsc(
            Long formationId,
            LocalDate sessionDate
    );
}