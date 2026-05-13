package com.esprit.microservice.events.repository;

import com.esprit.microservice.events.entity.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventCategoryRepository extends JpaRepository<EventCategory, Long> {

    Optional<EventCategory> findByName(String name);

    List<EventCategory> findByActiveTrueOrderByDisplayOrderAsc();

    boolean existsByName(String name);
}