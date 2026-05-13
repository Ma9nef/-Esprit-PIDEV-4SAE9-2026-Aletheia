package com.esprit.microservice.courses.repository;


import com.esprit.microservice.courses.entity.progress.FormationEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FormationEnrollmentRepository extends JpaRepository<FormationEnrollment, Long> {

    List<FormationEnrollment> findByUserId(Long userId);

    List<FormationEnrollment> findByFormation_Id(Long formationId);

    Optional<FormationEnrollment> findByUserIdAndFormation_Id(Long userId, Long formationId);

    boolean existsByUserIdAndFormation_Id(Long userId, Long formationId);
}