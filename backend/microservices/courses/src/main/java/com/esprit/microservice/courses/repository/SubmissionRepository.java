package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SubmissionRepository extends JpaRepository<Submission, Long> {
}
