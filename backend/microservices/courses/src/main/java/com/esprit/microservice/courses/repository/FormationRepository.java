package com.esprit.microservice.courses.repository;

import com.esprit.microservice.courses.entity.formations.Formation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface FormationRepository extends JpaRepository<Formation, Long> {
    List<Formation> findByInstructorId(Long instructorId);

    List<Formation> findByArchivedFalse();

    List<Formation> findByArchivedTrue();

}