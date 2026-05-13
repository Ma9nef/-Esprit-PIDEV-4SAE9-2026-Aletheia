package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.QuestionOption;
import org.springframework.data.jpa.repository.JpaRepository;


public interface QuestionOptionRepository extends JpaRepository<QuestionOption, Long> {
}
