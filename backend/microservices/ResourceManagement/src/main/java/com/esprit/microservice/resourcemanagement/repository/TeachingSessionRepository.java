package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.TeachingSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TeachingSessionRepository extends JpaRepository<TeachingSession, UUID> {

    List<TeachingSession> findByInstructorId(String instructorId);
}
