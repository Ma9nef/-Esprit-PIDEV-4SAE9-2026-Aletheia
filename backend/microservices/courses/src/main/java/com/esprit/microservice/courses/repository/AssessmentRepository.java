package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {


}
