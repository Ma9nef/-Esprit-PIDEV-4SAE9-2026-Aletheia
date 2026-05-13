package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.InstructorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InstructorProfileRepository extends JpaRepository<InstructorProfile, String> {

    List<InstructorProfile> findAllByOrderByReputationScoreDesc();
}
