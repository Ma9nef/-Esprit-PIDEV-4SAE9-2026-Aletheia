package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ModuleRepository extends JpaRepository<CourseModule, Long> {
}
