package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;



public interface QuestionRepository extends JpaRepository<Question, Long> {
}
