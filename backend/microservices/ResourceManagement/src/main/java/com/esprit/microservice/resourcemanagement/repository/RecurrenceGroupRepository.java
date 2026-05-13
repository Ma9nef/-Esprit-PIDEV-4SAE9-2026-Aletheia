package com.esprit.microservice.resourcemanagement.repository;

import com.esprit.microservice.resourcemanagement.entity.RecurrenceGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RecurrenceGroupRepository extends JpaRepository<RecurrenceGroup, UUID> {

    List<RecurrenceGroup> findByCreatedBy(String createdBy);
}
